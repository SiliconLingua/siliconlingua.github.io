import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep production assets portable when the site is served from a subpath.
  base: './',
});
