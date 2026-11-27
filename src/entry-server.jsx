// Point d'entrée du rendu côté Node, utilisé uniquement pendant `bun run build`
// par scripts/prerender.mjs. Rien de ce fichier n'est envoyé au navigateur.
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App.jsx'
import NotFound from './components/NotFound.jsx'

export { content, site } from './content.js'
export { depth, href, rootRel, routeFor, routes, sectionPath, sections } from './routes.js'

export function render(route) {
  return renderToString(<App route={route} />)
}

export function renderNotFound(homeUrls) {
  return renderToStaticMarkup(<NotFound homeUrls={homeUrls} />)
}
