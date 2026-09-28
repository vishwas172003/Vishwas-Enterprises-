# Vishwas Enterprises website

Single-page business website for Vishwas Enterprises, Pimple Gurav, Pune: pneumatic air piping, oil management systems, two-post lifts, garage equipment and AMC.

Live: https://vishwas-enterprises.vercel.app/

## Structure

```
index.html            The whole site (edit text, photos and contact details here)
404.html              "Page not found" page
assets/css/site.css   All styles (colours are set at the top under :root)
assets/js/site.js     Menus, photo viewer, videos, air-system explainer, enquiry form
                      (phone numbers and emails for the pop-ups are at the top)
assets/fonts/         Archivo variable font, self-hosted (SIL Open Font License)
assets/img/gallery/   Web-optimised photos, each in two sizes (-800 and -1600)
assets/img/brands/    Brand logos, cleaned to one colour
assets/img/video/     Video cover images
assets/icons/         Favicons and app icons
Photos/               Original photos and videos (videos are played from here)
robots.txt, sitemap.xml, site.webmanifest, vercel.json   SEO and hosting settings
```

## Common edits

**Change a phone number or email:** update it in `index.html` (search for the old number) and in the `CONTACT` block at the top of `assets/js/site.js`.

**Add a project photo:**
1. Save two WebP versions, about 800 px and 1600 px wide, into `assets/img/gallery/` as `name-800.webp` and `name-1600.webp`.
2. In `index.html`, copy an existing `<figure class="shot" ...>` block in the gallery and change the file names, caption and `data-cat` (`workshop`, `industrial` or `oil`).
3. Update the count in the matching filter button.

**Add a video:** put the MP4 in `Photos/`, add a 480 x 600 cover image in `assets/img/video/`, then copy an existing `<li>` in the video list and change the paths, title and length.

**Add customer reviews:** a ready template is in a comment near the end of `index.html`. Publish only real reviews you have permission to use.

## If the domain changes

Replace `https://vishwas-enterprises.vercel.app/` in `index.html`, `robots.txt` and `sitemap.xml`.
