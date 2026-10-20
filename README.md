# Archana M — portfolio

A one-page portfolio built as a personal balance sheet: ledger grid, human margins, crochet sunflowers.
Static site (Astro). It loads fast, works on phones, and deploys to Vercel's free plan.

## Run it locally

Needs **Node.js 22.22 or newer** (`node -v` to check).

```bash
npm install
npm run dev        # http://localhost:4321 — live reload while editing
npm run build      # production build into ./dist
npm run preview    # serve the production build locally
```

The splash screen only shows once per browser tab. To see it again, open a new tab, or run
`sessionStorage.clear()` in the browser console and reload.

## Edit the content

Almost everything lives in **`src/data/site.ts`**: name, email, LinkedIn, Spotify link, jobs, skills, hobbies,
education and languages. Change it there, not in the components.

| To change… | Edit |
|---|---|
| Spotify button link | `site.spotify` — use the song's own link (Spotify → Share → Copy song link) |
| Play the song on the page | `site.spotifyTrackId` — the ID from that link (`open.spotify.com/track/<ID>`). The record then loads Spotify's player in place, only when tapped |
| Hero photo | put it in `public/` and set `site.portrait` (e.g. `'/archana.jpg'`) |
| Résumé download | replace `public/archana-m-resume.pdf` (keep the file name) |
| “Placeholder” tags on hobby cards | `site.showPlaceholderTags = false` |
| Share preview image (WhatsApp/LinkedIn) | `public/og.jpg` (1200×630) |
| Colours | tokens at the top of `src/styles/global.css` |

### Swapping in real photos

1. Put images in `src/assets/` (JPG or PNG, roughly 1200px wide is plenty).
2. In `src/components/sections/OffTheBooks.astro` (hobby cards) or `Hero.astro` (portrait), import Astro's
   `Image` component and replace the illustration:
   ```astro
   ---
   import { Image } from 'astro:assets';
   import crochet from '../../assets/crochet.jpg';
   ---
   <Image src={crochet} alt="Crochet sunflowers on a desk" widths={[320, 640]} sizes="(max-width: 860px) 72vw, 275px" loading="lazy" />
   ```
   Astro resizes and converts them to WebP/AVIF at build time, so the page stays light.

## Deploy to Vercel (free)

1. Push this folder to a new GitHub repository.
2. On vercel.com: **Add New → Project → import the repository**.
3. Vercel detects Astro automatically. Build command `npm run build`, output `dist`. Click **Deploy**.
4. Every later push redeploys automatically; other branches get their own preview links.

Optional: set an environment variable `SITE_URL` (e.g. `https://archana-m.vercel.app` or a custom domain) so share
previews always use the right absolute image link. Without it, the Vercel production URL is used.

## How it's built

```
src/
  data/site.ts              ← all content
  layouts/Base.astro        ← <head>, fonts, splash decision, toast
  components/Splash.astro   ← first-visit bloom (CSS-only timeline)
  components/sections/      ← Nav, Hero, Ticker, Statement, Assets, OffTheBooks, Documents, Contact, StickyBar, ContentsDialog
  components/motifs/        ← sunflower, lavender, sprig, bouquet, rangoli, mehndi vine + mandala (SVG, same geometry as Figma)
  scripts/main.ts           ← smooth scroll, reveals, buttons, player, carousel, dialog, sticky bar
  styles/global.css         ← tokens, fonts, buttons, toast
public/
  fonts/                    ← self-hosted woff2 (latin subset)
  favicon.svg, apple-touch-icon.png, og.jpg, archana-m-resume.pdf
vercel.json                 ← long-cache headers for fonts/assets + basic security headers
```

**Motion principles:** one orchestrated moment (the splash bloom landing in the hero); everything else responds to a
scroll or a tap. In the hero, the flowers, photo card, receipt and sticker can be rearranged: drag with a mouse, or press & hold then
drag on touch screens (a quick swipe still scrolls). “Tidy up ↺” resets them. Only `transform` and `opacity` are animated. Smooth scrolling (Lenis) runs on desktop only and
starts on the first wheel/key press. Phones keep native scrolling. Anyone with *reduce motion* switched on gets no
splash and no animation.

**Accessibility:** semantic headings and landmarks, skip link, visible focus rings, keyboard-operable menu (native
`<dialog>`), decorative SVGs hidden from screen readers, colour contrast checked (text pairs ≥ 4.5:1).

## Measured results

Lighthouse 12, mobile, simulated slow 4G, served with gzip and cache headers like Vercel:

| Performance | Accessibility | Best practices | SEO |
|---|---|---|---|
| 97 | 100 | 100 | 100 |

LCP 2.3 s · TBT 0 ms · CLS 0.003 · total transfer 221 KB · JS ≈ 8 KB gzipped · 0 image requests.
Layout checked at 1440, 1024, 768, 390 and 360px wide (no horizontal overflow).

**Not yet tested:** real phones, Safari/iOS and Firefox, and the live Vercel deployment.

## Before sharing the link

- [ ] Replace the Spotify search link with the song's own link (`site.spotify`) and set `site.spotifyTrackId`.
- [ ] Update the résumé PDF. The current one still says “Archana PM” and **includes her phone number**.
- [ ] Hobby photos are in `src/assets/hobbies/` — make sure every one is Archana’s own work before going live (the cards say “Yes, I made this”).
- [ ] Hero portrait: add a photo via `site.portrait` when ready.
