import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset URLs. iGEM serves each wiki from a subpath
  // (https://2026.igem.wiki/washington/), so the default absolute "/assets/..."
  // would 404 there. With "./" the bundle works from any subpath and from
  // file:// previews.
  base: './',
  plugins: [react(), tailwindcss()],
})
