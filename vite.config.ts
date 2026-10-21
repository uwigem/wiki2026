import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ALL_ROUTES } from './src/site/content/nav'
import { LAWN_FILE, gardenFile } from './src/site/garden/gardens'
import { cdnUrl } from './src/site/cdn'

// Node's environment, without pulling in all of @types/node for one line.
declare const process: { env: Record<string, string | undefined> }

/**
 * A copy of index.html for every page (`model/index.html`, ...) plus a
 * `404.html`, so a direct link to any page loads the app on any static host,
 * including ones with no rewrite rules such as GitHub Pages. The router then
 * reads the path and shows the page.
 *
 * Every copy also preloads its background from the CDN: the lawn behind every
 * page (one 1.7 KB tile), and that page's own garden. Both start downloading
 * alongside the script, so the background is ready when the page is.
 */
function pagePerRoute(): Plugin {
  const preload = (file: string) => `<link rel="preload" as="image" href="${cdnUrl(file)}" />`
  return {
    name: 'page-per-route',
    enforce: 'post',
    // The lawn, on every page and in `npm run dev` too.
    transformIndexHtml: () => [
      { tag: 'link', attrs: { rel: 'preload', as: 'image', href: cdnUrl(LAWN_FILE) }, injectTo: 'head' },
    ],
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return
      for (const { to } of ALL_ROUTES) {
        if (to === '/') continue
        const garden = gardenFile(to)
        const source = garden
          ? String(html.source).replace('</head>', `  ${preload(garden)}\n  </head>`)
          : html.source
        this.emitFile({ type: 'asset', fileName: `${to.slice(1)}/index.html`, source })
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: html.source })
    },
  }
}

export default defineConfig(({ command }) => ({
  // Pages live at real paths under this base, and asset URLs are absolute from
  // it. A build defaults to iGEM's https://2026.igem.wiki/washington/, which
  // BASE_PATH overrides if a build ever needs a different base; `npm run dev`
  // serves from the root.
  base: process.env.BASE_PATH ?? (command === 'build' ? '/washington/' : '/'),
  plugins: [react(), tailwindcss(), pagePerRoute()],
}))
