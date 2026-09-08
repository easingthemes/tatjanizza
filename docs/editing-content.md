# Editing the site

This is for changing the site's words and pictures. You don't need to install anything, and you
can't break the site by editing content — everything is saved with a full history, so anything can
be undone.

## Getting in

Go to **https://www.tatjanizza.com/admin** and log in.

You'll need to have been invited to the project on TinaCloud first — if the login doesn't recognise
you, that invitation is the missing piece. To log out again, visit
`https://www.tatjanizza.com/exit-admin`.

## How editing works

The editor shows the real site on one side and a form on the other. Two ways to change something:

- **Click on it.** Most text and images on the page can be clicked directly, which jumps the form to
  the matching field.
- **Use the sidebar.** Pick the page or post from the list, then work through the fields.

Changes appear immediately in the preview. They are **not** live yet.

## Publishing

Press save. That writes the change to the project's history and starts a rebuild of the site.

**The live site takes about a minute or two to catch up.** This is normal — if you reload
www.tatjanizza.com straight after saving and see the old version, wait a moment and reload again.

## Pages and sections

Pages (like the home page and About) are built from **sections** stacked in order — a hero, a block
of text, statistics, a quote, a video, and so on. In the editor you can:

- reorder sections by dragging them
- add a section and pick which kind it is
- delete a section
- change each section's background colour

If you want a kind of section that doesn't exist yet, that needs a developer.

## Blog posts

Posts live under **Blog Posts** in the sidebar. Each has a title, a hero image, a short excerpt, an
author, tags, and the body text.

The body is a rich text editor — bold, italics, links, headings, lists, images and quotes all work.
The excerpt is what shows in the list of posts, so it's worth writing rather than leaving empty.

## Pictures

Upload images through the editor's media browser. A few things worth knowing:

- **Resize before uploading.** Photos straight from a camera or phone are often 5–10 MB, which is
  far larger than a web page needs. Around 2000 pixels on the longest side is plenty. Smaller files
  make the site faster.
- **JPEG** for photographs, **PNG** for graphics with flat colour or transparency.
- Every image should get **alt text** — a short description of what's in it. It's what people using
  a screen reader hear, and it's what search engines read.

## One thing to know right now

**The home page is currently replaced by a temporary "coming soon" screen.**

That screen is built in code, not in the CMS. So if you edit the home page in the editor, your
changes are saved correctly but **won't show on the live site** until the real home page is switched
back on. Everything else — blog posts, the About page — behaves normally.

## Things to leave alone

Under **Global** you'll find site-wide settings: the site name, the navigation links, the social
links, and the colour theme. These are safe to edit, but a mistake here shows up on *every* page
rather than just one, so it's worth a second look before saving.

## If something looks wrong

Nothing you do in the editor is permanent — every save is recorded and can be rolled back. If the
site looks broken after a change, say what you changed and roughly when, and it can be reversed.
