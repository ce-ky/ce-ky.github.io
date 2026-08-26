// OAuth proxy for Decap CMS (admin/config.yml's `backend.base_url`) sitting
// in front of GitHub's login. GitHub Pages can only serve static files, so
// the "exchange this code for an access token" step — which needs a client
// secret that must never reach the browser — has to happen somewhere else.
// This Worker is that somewhere else. It holds no state of its own; every
// request carries what it needs.
//
// Deploy: Cloudflare dashboard -> Workers & Pages -> Create -> paste this
// file in -> Settings -> Variables -> add GITHUB_CLIENT_ID and
// GITHUB_CLIENT_SECRET (the values from the GitHub OAuth App you create,
// see admin/oauth-worker/README.md) -> Deploy. Then set admin/config.yml's
// `base_url` to the Worker's own URL (https://<name>.<subdomain>.workers.dev).

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

const WORKER_VERSION = "2026-08-26-1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/" || url.pathname === "/status") {
        return new Response(
          JSON.stringify({
            ok: true,
            worker_version: WORKER_VERSION,
            has_client_id: Boolean(env.GITHUB_CLIENT_ID),
            has_client_secret: Boolean(env.GITHUB_CLIENT_SECRET),
          }, null, 2),
          { headers: { "Content-Type": "application/json" } }
        );
      }
      if (url.pathname === "/auth") {
        return handleAuth(url, env);
      }
      if (url.pathname === "/callback") {
        return handleCallback(url, env);
      }
      return new Response("Not found: " + url.pathname, { status: 404 });
    } catch (err) {
      return new Response("Worker error: " + (err && err.stack || err), { status: 500 });
    }
  },
};

function handleAuth(url, env) {
  const state = crypto.randomUUID();
  const redirectUri = new URL("/callback", url).toString();

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  return Response.redirect(authorizeUrl.toString(), 302);
}

async function handleCallback(url, env) {
  const code = url.searchParams.get("code");
  if (!code) {
    return renderResult({ error: "missing_code" });
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenResponse.json();

  if (data.error || !data.access_token) {
    return renderResult({ error: data.error_description || data.error || "token_exchange_failed" });
  }

  return renderResult({ token: data.access_token, provider: "github" });
}

// Decap's popup-based auth listens on window.opener for a postMessage
// string shaped exactly like this. See:
// https://decapcms.org/docs/external-oauth-clients/
function renderResult(payload) {
  const success = !payload.error;
  const message = `authorization:github:${success ? "success" : "error"}:${JSON.stringify(payload)}`;

  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(
            ${JSON.stringify(message)},
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
