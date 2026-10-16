import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

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
