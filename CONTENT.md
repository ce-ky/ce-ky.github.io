# Updating content

The site has four content sections — **Games** (projects), **Drawings**,
**Other Stuffs**, and **Log** — each backed by a folder of Markdown files:
`_projects/`, `_drawings/`, `_other/`, `_log/`. Jekyll turns every file in
those folders into one card/list entry on the matching page, plus its own
detail page if you don't give it a link elsewhere. Adding, editing, or
removing a file is the whole update — no HTML/CSS to touch.

**Drawings work differently from the other three.** They show as a
waterfall (masonry) gallery on `/drawings/menu.html` — columns of equal
width, each image's height following its own aspect ratio, 1/2/3 columns
depending on window width. There's no per-drawing detail page: clicking a
thumbnail pops up that same image full-size instead. So a drawing entry
only needs `cover` (`title` is optional, just a caption) — skip
`link`/`link_label`/`external`/`body`, they're not used. Upload the actual
image (not a pre-shrunk thumbnail) as `cover`, since it's shown both as the
gallery thumbnail and the full-size popup image — and upload it at a
resolution at least as large as you'd ever want it displayed, since the
waterfall stretches an undersized image up to fill its column, which
looks soft/blurry the same way any upscaled image would.

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

For a drawing, put the file in `_drawings/` instead and only use `cover`
(`title` is optional — see below) — `link`/`link_label`/`external`/`date`/
body text are ignored there.

Commit. GitHub Pages rebuilds the site automatically within a minute or two.

## Field reference

Games, Other Stuffs, and Log:

| Field | Required | What it does |
|---|---|---|
| `title` | yes | The name shown on the card/list entry, and as the page heading if it gets its own detail page. |
| `link` | no | Where the card's button goes. Leave it out and it points at an auto-generated page showing `title` + the Markdown body instead. |
| `link_label` | no | Button text. Defaults to "Details". |
| `external` | no | `true` opens `link` in a new tab (use for itch.io etc.). |
| `date` | no | Not shown anywhere yet, but useful for your own sorting later. |
| `cover` | no | Path to an image, shown at the top of the entry's own detail page. |

Drawings:

| Field | Required | What it does |
|---|---|---|
| `title` | no | Used as the image's alt text and as the caption under the popup when a thumbnail is clicked. Leave it out and the image just has no caption. |
| `cover` | yes | Path to the image. Shown as the waterfall thumbnail and, at full size, in the click-to-enlarge popup — upload the real image, not a shrunk-down version, and at least as large as you'd want it shown (undersized images get stretched to fill their column and look blurry). |

Files inside each folder list in filename order, so prefix filenames with a
number (`01-`, `02-`, ...) if you care about the order they appear in.
