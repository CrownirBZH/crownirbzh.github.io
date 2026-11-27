import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.jsx'
import { content } from './content.js'
import { routeById, routeFromPath } from './routes.js'

const el = document.getElementById('root')
const prerendered = routeById(el.dataset.route)

if (prerendered) {
  // Site compilé : le HTML est déjà dans la page, React s'y rattache.
  hydrateRoot(
    el,
    <StrictMode>
      <App route={prerendered} />
    </StrictMode>,
  )
} else {
  // `vite dev` : pas de prérendu, la page est déduite de l'adresse.
  const route = routeFromPath(window.location.pathname)
  const { meta } = content[route.lang]
  document.documentElement.lang = route.lang
  document.title = route.page === 'legal' ? meta.legalTitle : meta.title
  createRoot(el).render(
    <StrictMode>
      <App route={route} />
    </StrictMode>,
  )
}
