import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { installFavicon } from './site/favicon'
import { installPaletteVars } from './site/palette-vars'
import { checkContent } from './site/content/check'
import './index.css'

// Publish the engine palette as CSS variables before the first paint, so every
// colour on the site comes from src/engine/palette.ts and nowhere else.
installPaletteVars()
installFavicon()

// Warns in the console about a page that is unreachable or numbered out of
// order. Stripped from the production build.
if (import.meta.env.DEV) checkContent()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
