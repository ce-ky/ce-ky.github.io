# One-time setup: login for /admin

`/admin` (the content upload page) needs somewhere to send you to log in with
GitHub, and somewhere to receive you back with a token — GitHub Pages can't
do that itself since it only serves static files. `worker.js` in this folder
is that piece. It's small, free to run, and only needs to be set up once.

## 1. Create a GitHub OAuth App

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: anything, e.g. `ce-ky.github.io admin`
   - **Homepage URL**: `https://ce-ky.github.io`
   - **Authorization callback URL**: `https://<your-worker-name>.<your-subdomain>.workers.dev/callback`
     (you'll get the exact worker URL in step 2 below — come back and fill
     this in once you have it, GitHub lets you edit it after creating the app)
3. Click **Register application**, then **Generate a new client secret**.
4. Keep the **Client ID** and **Client Secret** handy — you'll paste them into
   Cloudflare in the next step. Never put the secret in any file in this repo.

## 2. Deploy the Worker on Cloudflare (free tier)

There are two ways to get `worker.js` running on Cloudflare. Pick one.

### 2a. Connect the repo to Cloudflare (auto-deploys on every push)

1. Sign up / log in at <https://dash.cloudflare.com> (free account, no credit
   card needed for the Workers free tier).
2. **Workers & Pages** → **Create** → **Workers** → **Import a repository**
   (sometimes labeled "Deploy from Git" / "Workers Builds"), and connect
   this GitHub repo.
3. Cloudflare reads `wrangler.toml` at the repo root — it already points at
   `admin/oauth-worker/worker.js`, so leave the build settings as default
   (root directory `/`, no build command needed).
4. `GITHUB_CLIENT_ID` is already set via `wrangler.toml` in this repo (it's
   not sensitive — it's public in the OAuth redirect URL anyway). The
   secret still needs to be set, but **the dashboard's "Variables and
   secrets" / "Runtime variables and secrets" panels have not been
   reliably sticking for this project** — values entered there kept
   reverting to unset. Skip them and use the **"Set Cloudflare Worker
   secrets"** GitHub Action in this repo instead (Actions tab → select it
   → **Run workflow**), which sets the secret directly via the Cloudflare
   API. One-time setup for that:
   - Create a Cloudflare API token: <https://dash.cloudflare.com/profile/api-tokens>
     → **Create Token** → template **"Edit Cloudflare Workers"** → scope it
     to your account → **Continue to summary** → **Create Token** → copy it
     (shown once).
   - In this GitHub repo: **Settings** → **Secrets and variables** →
     **Actions** → **New repository secret**, add two:
     - `CLOUDFLARE_API_TOKEN` = the token you just created
     - `DECAP_GITHUB_CLIENT_SECRET` = the Client Secret from step 1
   - **Actions** tab → **Set Cloudflare Worker secrets** → **Run workflow**.
   - Check `<worker-url>/status` afterward — `has_client_secret` should
     read `true`. Since this doesn't touch the dashboard at all, it
     shouldn't get reset by the next `git push`; re-run the workflow if it
     ever does.
5. Note the worker's URL, shown at the top of its page:
   `https://<your-worker-name>.<your-subdomain>.workers.dev`. Every future
   push to this repo redeploys the worker automatically — a failed build
   shows up as a "Workers Builds" check on the pull request.

### 2b. Or: paste the code in manually (no git connection)

1. Sign up / log in at <https://dash.cloudflare.com>.
2. **Workers & Pages** → **Create** → **Create Worker**. Give it a name →
   **Deploy** (deploys a placeholder first, that's fine).
3. **Edit code**, delete the placeholder, paste in the contents of
   `worker.js` from this folder → **Deploy**.
4. Same **Variables and Secrets** step as 2a.4 above.
5. Same as 2a.5 — note the worker's URL.

## 3. Wire everything together

1. Go back to the GitHub OAuth App from step 1 and set its **Authorization
   callback URL** to `<worker-url>/callback`.
2. Edit `admin/config.yml` in this repo: set `backend.base_url` to the
   worker URL from step 2a.5/2b.5 (no trailing slash). Commit and push.

## 4. Try it

Visit `https://ce-ky.github.io/admin/`, click **Login with GitHub**, approve
the app. You should land in the CMS with the four collections (Projects /
Drawings / Other / Log) listed on the left. Publishing an entry there commits
straight to this repo's `main` branch, same as pushing from git — GitHub
Pages will rebuild the site automatically afterward.

Only people with push access to this repo can actually publish through it —
GitHub's own permissions decide that, the Worker just relays the login.
