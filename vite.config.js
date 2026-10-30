import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // This is a GitHub Pages user site. Use absolute assets on nested pages.
  // A project-site deployment can explicitly set VITE_BASE_PATH=/repository/.
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        lmlab: fileURLToPath(new URL('./lmlab/index.html', import.meta.url)),
      },
    },
  },
});
