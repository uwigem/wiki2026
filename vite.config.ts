import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ALL_ROUTES } from './src/site/content/nav'
import { gardenFile } from './src/site/garden/gardens'

// Node's environment, without pulling in all of @types/node for one line.
declare const process: { env: Record<string, string | undefined> }

/**
 * A copy of index.html for every page (`model/index.html`, ...) plus a
 * `404.html`, so a direct link to any page loads the app on any static host,
 * including ones with no rewrite rules such as GitHub Pages. The router then
 * reads the path and shows the page.
 */
function pagePerRoute(): Plugin {
  let base = '/'
  return {
    name: 'page-per-route',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      base = config.base
    },
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return
      for (const { to } of ALL_ROUTES) {
        if (to === '/') continue
        // Each page's HTML starts fetching that page's garden straight away,
        // alongside the script, so the background is ready when the page is.
        const garden = gardenFile(to)
        const source = garden
          ? String(html.source).replace('</head>', `  <link rel="preload" as="image" href="https://static.igem.wiki/teams/6229/wiki/${garden.replace(/\.png$/, '.avif')}" />\n  </head>`)
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
