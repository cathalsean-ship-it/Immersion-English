import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://immersion-english.com',
  trailingSlash: 'never',
  // Inline the (small) stylesheet so it doesn't block first paint.
  build: { inlineStylesheets: 'always' },
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
