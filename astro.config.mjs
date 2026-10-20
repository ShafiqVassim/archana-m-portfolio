import { defineConfig } from 'astro/config';

// Static output — Vercel serves it from the edge with no server cost.
export default defineConfig({
  // Set this to your Vercel URL (or custom domain) so share previews use an absolute image link.
  site: process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined),
  compressHTML: true,
  build: { inlineStylesheets: 'always' }, // one less request on first load
});
