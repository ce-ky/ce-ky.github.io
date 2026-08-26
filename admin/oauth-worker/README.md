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

1. Sign up / log in at <https://dash.cloudflare.com> (free account, no credit
   card needed for the Workers free tier).
2. **Workers & Pages** → **Create** → **Create Worker**. Give it a name (e.g.
   `ceky-cms-auth`) → **Deploy** (deploys a placeholder first, that's fine).
3. **Edit code**, delete the placeholder, paste in the contents of
   `worker.js` from this folder → **Deploy**.
4. Back on the worker's page, go to **Settings** → **Variables and Secrets**
   → **Add**:
   - `GITHUB_CLIENT_ID` = the Client ID from step 1
   - `GITHUB_CLIENT_SECRET` = the Client Secret from step 1 (mark it as a
     **secret**, not a plain text variable)
5. Save. Note the worker's URL, shown at the top of its page:
   `https://<your-worker-name>.<your-subdomain>.workers.dev`

## 3. Wire everything together

1. Go back to the GitHub OAuth App from step 1 and set its **Authorization
   callback URL** to `<worker-url>/callback`.
2. Edit `admin/config.yml` in this repo: set `backend.base_url` to the
   worker URL from step 2.4 (no trailing slash). Commit and push.

## 4. Try it

Visit `https://ce-ky.github.io/admin/`, click **Login with GitHub**, approve
the app. You should land in the CMS with the four collections (Projects /
Drawings / Other / Log) listed on the left. Publishing an entry there commits
straight to this repo's `main` branch, same as pushing from git — GitHub
Pages will rebuild the site automatically afterward.

Only people with push access to this repo can actually publish through it —
GitHub's own permissions decide that, the Worker just relays the login.
