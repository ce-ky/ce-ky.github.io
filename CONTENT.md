# Updating content

The site has four content sections — **Games** (projects), **Drawings**,
**Other Stuffs**, and **Log** — each backed by a folder of Markdown files:
`_projects/`, `_drawings/`, `_other/`, `_log/`. Jekyll turns every file in
those folders into one card/list entry on the matching page, plus its own
detail page if you don't give it a link elsewhere. Adding, editing, or
removing a file is the whole update — no HTML/CSS to touch.

## Option A — the `/admin` upload page

Go to `https://ce-ky.github.io/admin/`, log in with GitHub, pick a
collection, fill in the fields, drag in a cover image if you have one, hit
**Publish**. That's it — it commits straight to this repo.

(One-time setup required before this works — see
`admin/oauth-worker/README.md`.)

## Option B — edit files directly on GitHub

No setup needed, works from a phone. Open the relevant folder on
github.com (e.g. `_projects/`) → **Add file** → **Create new file** →
name it something like `my-new-thing.md` → paste in:

```markdown
---
title: "My New Thing"
link: https://example.com          # optional — omit for an auto-generated detail page instead
link_label: "itch.io"              # optional, defaults to "Details"
external: true                     # optional, opens link in a new tab
date: 2026-08-26                   # optional
cover: /files/uploads/my-cover.png # optional, upload the image into files/uploads/ first
---
Anything written here becomes the body of this entry's own detail page
(only used when `link` above is left out).
```

Commit. GitHub Pages rebuilds the site automatically within a minute or two.

## Field reference

| Field | Required | What it does |
|---|---|---|
| `title` | yes | The name shown on the card/list entry, and as the page heading if it gets its own detail page. |
| `link` | no | Where the card's button goes. Leave it out and it points at an auto-generated page showing `title` + the Markdown body instead. |
| `link_label` | no | Button text. Defaults to "Details". |
| `external` | no | `true` opens `link` in a new tab (use for itch.io etc.). |
| `date` | no | Not shown anywhere yet, but useful for your own sorting later. |
| `cover` | no | Path to an image, shown at the top of the entry's own detail page. |

Files inside each folder list in filename order, so prefix filenames with a
number (`01-`, `02-`, ...) if you care about the order they appear in.
