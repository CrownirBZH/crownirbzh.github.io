// Table des pages du site. Partagée par le navigateur, le rendu serveur
// et le script de prérendu : aucune API navigateur ici.
//
// `path` est relatif à la racine du site et se termine toujours par « / »
// (sauf l'accueil français, qui est la racine elle-même).

export const routes = [
  { id: 'fr-home', lang: 'fr', page: 'home', path: '' },
  { id: 'en-home', lang: 'en', page: 'home', path: 'en/' },
  { id: 'fr-legal', lang: 'fr', page: 'legal', path: 'mentions-legales/' },
  { id: 'en-legal', lang: 'en', page: 'legal', path: 'en/legal-notice/' },
]

export const defaultRoute = routes[0]

// Nombre de dossiers entre la page et la racine du site.
export function depth(route) {
  return route.path.split('/').filter(Boolean).length
}

// Chemin relatif de la page vers la racine du site : './', '../', '../../'.
export function rootRel(route) {
  return '../'.repeat(depth(route)) || './'
}

// Lien relatif d'une page vers une autre : './en/', '../', '../../mentions-legales/'.
export function href(from, to) {
  return rootRel(from) + to.path
}

export function routeFor(lang, page) {
  return routes.find((route) => route.lang === lang && route.page === page)
}

export function routeById(id) {
  return routes.find((route) => route.id === id)
}

// Sections de la page d'accueil. Chacune a sa propre adresse, sans « # » :
// /pentest, /retro-ingenierie, /en/reverse-engineering, etc.
// Le build écrit pour chacune une copie de l'accueil (pentest.html…), rangée
// dans le même dossier que lui : les liens relatifs restent donc identiques.
export const sections = [
  { id: 'pentest', slug: { fr: 'pentest', en: 'pentest' } },
  { id: 'reverse', slug: { fr: 'retro-ingenierie', en: 'reverse-engineering' } },
  { id: 'dev', slug: { fr: 'developpement', en: 'development' } },
  { id: 'about', slug: { fr: 'a-propos', en: 'about' } },
  { id: 'faq', slug: { fr: 'faq', en: 'faq' } },
  { id: 'contact', slug: { fr: 'contact', en: 'contact' } },
]

// Chemin d'une section depuis la racine du site : 'pentest', 'en/pentest'.
export function sectionPath(lang, id) {
  const section = sections.find((item) => item.id === id)
  return routeFor(lang, 'home').path + section.slug[lang]
}

// Lien relatif d'une page vers une section de l'accueil de la même langue.
export function sectionHref(from, id) {
  return rootRel(from) + sectionPath(from.lang, id)
}

// Section désignée par une adresse (/pentest, /en/about), ou null.
export function sectionFromPath(pathname, lang) {
  const last = pathname
    .replace(/\/+$/, '')
    .replace(/\.html$/, '')
    .split('/')
    .pop()
  return sections.find((item) => item.slug[lang] === last)?.id ?? null
}

// Utilisé uniquement par `vite dev`, où les pages ne sont pas prérendues.
export function routeFromPath(pathname) {
  const path = pathname.replace(/^\/+/, '').replace(/index\.html$/, '')
  const exact = routes.find((route) => route.path === path || route.path === `${path}/`)
  if (exact) return exact
  return routeFor(path === 'en' || path.startsWith('en/') ? 'en' : 'fr', 'home')
}
