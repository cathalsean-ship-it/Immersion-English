import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { readdirSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Also write every page as <page>/index.html, so /lessons/ is served directly
// (200) instead of redirecting to /lessons.
//
// Why: until 16 Oct 2026 Netlify answered /lessons with a PERMANENT redirect
// to /lessons/. Browsers cache permanent redirects. Once the site switched to
// /lessons (format 'file' below), those browsers bounced /lessons -> /lessons/
// (from cache) -> /lessons (from Netlify) -> ... and showed
// ERR_TOO_MANY_REDIRECTS. With both forms answering 200 there is nothing to
// bounce between. Search engines still see one page: the canonical tag on
// both says /lessons.
//
// Do not remove this unless every visitor's cached redirect has expired,
// which for some browsers is never.
const slashCopies = {
  name: 'slash-copies',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const root = fileURLToPath(dir);
      const walk = (d) => {
        for (const name of readdirSync(d)) {
          const p = join(d, name);
          if (statSync(p).isDirectory()) { if (name !== '_astro' && name !== 'og' && name !== 'fonts') walk(p); continue; }
          if (!name.endsWith('.html') || p === join(root, 'index.html') || p === join(root, '404.html')) continue;
          const target = join(d, name.slice(0, -5));
          mkdirSync(target, { recursive: true });
          copyFileSync(p, join(target, 'index.html'));
        }
      };
      walk(root);
    },
  },
};

export default defineConfig({
  site: 'https://immersion-english.com',
  trailingSlash: 'never',
  // Inline the (small) stylesheet so it doesn't block first paint.
  //
  // 'file' builds /lessons as lessons.html (not lessons/index.html), so Netlify
  // serves /lessons directly with a 200 instead of redirecting to /lessons/.
  // Every canonical, og:url, sitemap entry and internal link uses the
  // no-slash form; this keeps the server consistent with them.
  build: { inlineStylesheets: 'always', format: 'file' },
  integrations: [
    tailwind(),
    slashCopies,
  ],
  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    }
  }
});
