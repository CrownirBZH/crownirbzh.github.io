// Prérendu statique, lancé par `bun run build` après les deux builds Vite.
//
//   dist/      : build navigateur (index.html sert de gabarit)
//   dist-ssr/  : build Node de src/entry-server.jsx (supprimé à la fin)
//
// Pour chaque page de src/routes.js, ce script écrit un vrai fichier HTML
// (texte, <title>, description, balises de partage, données structurées),
// puis robots.txt, llms.txt et, si l'adresse du site est connue, sitemap.xml
// et 404.html. Tout le texte vient de src/content.js.

import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { AI_TRAINING, SITE_URL } from '../seo.config.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const distSsr = join(root, 'dist-ssr')

const HEAD_MARKER = '<!--app-head-->'
const ROOT_MARKER = '<div id="root"><!--app-html--></div>'
const OG_IMAGE = { file: 'og.png', width: 1200, height: 630 }
const OG_LOCALE = { fr: 'fr_FR', en: 'en_GB' }
const TITLE_MAX = 65
const DESCRIPTION_MAX = 160

// Robots nommés explicitement dans robots.txt.
const SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]
const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Applebot-Extended']

const warnings = []
const warn = (message) => warnings.push(message)

function fail(message) {
  throw new Error(`[prerender] ${message}`)
}

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------- Réglages ----------

function normaliseSiteUrl(raw) {
  const value = String(raw ?? '')
    .trim()
    .replace(/\/+$/, '')
  if (!value) return ''
  if (!value.startsWith('https://')) {
    fail(`SITE_URL doit commencer par https:// (valeur reçue : "${raw}").`)
  }
  let url
  try {
    url = new URL(value)
  } catch {
    fail(`SITE_URL n'est pas une adresse valide : "${raw}".`)
  }
  if (url.search || url.hash || url.username || url.password) {
    fail(`SITE_URL ne doit contenir ni paramètres, ni ancre, ni identifiants : "${raw}".`)
  }
  return value
}

const siteUrl = normaliseSiteUrl(SITE_URL)
if (AI_TRAINING !== 'allow' && AI_TRAINING !== 'disallow') {
  fail(`AI_TRAINING doit valoir 'allow' ou 'disallow' (valeur reçue : "${AI_TRAINING}").`)
}

// ---------- Entrées ----------

const ssrEntry = join(distSsr, 'entry-server.js')
if (!existsSync(ssrEntry)) fail(`build serveur introuvable : ${ssrEntry}`)
const { content, depth, render, renderNotFound, rootRel, routeFor, routes, sectionPath, sections, site } =
  await import(pathToFileURL(ssrEntry).href)

const template = await readFile(join(dist, 'index.html'), 'utf8')
for (const marker of [HEAD_MARKER, ROOT_MARKER]) {
  if (!template.includes(marker)) {
    fail(`repère ${marker} absent de dist/index.html : relancez "bun run build" en entier.`)
  }
}
if (!/<html lang="[^"]*">/.test(template)) fail('balise <html lang="…"> absente du gabarit.')

const assets = await readdir(join(dist, 'assets'))
const fontFiles = ['manrope-latin-wght-normal', 'jetbrains-mono-latin-wght-normal'].map((name) => {
  const file = assets.find((asset) => asset.startsWith(`${name}-`) && asset.endsWith('.woff2'))
  if (!file) warn(`police "${name}" introuvable dans dist/assets : pas de préchargement.`)
  return file
})
const hasOgImage = existsSync(join(dist, OG_IMAGE.file))
if (siteUrl && !hasOgImage) warn(`public/${OG_IMAGE.file} absent : pas d'image de partage (bun run og).`)

// ---------- Aides ----------

const absolute = (route) => `${siteUrl}/${route.path}`

function pageMeta(route) {
  const { meta } = content[route.lang]
  return route.page === 'legal'
    ? { title: meta.legalTitle, description: meta.legalDescription }
    : { title: meta.title, description: meta.description }
}

// Les mentions légales restent hors index tant qu'un champ est « à compléter ».
function isIndexable(route) {
  if (route.page !== 'legal') return true
  return !content[route.lang].legal.sections.some((section) =>
    section.rows?.some(([, value]) => value === null || value === undefined),
  )
}

const alternatesOf = (route) => routes.filter((other) => other.page === route.page)

// ---------- Données structurées (pages d'accueil) ----------

function jsonLd(route) {
  const t = content[route.lang]
  const { location } = site
  const id = (fragment) => (siteUrl ? `${siteUrl}/#${fragment}` : `#${fragment}`)
  const withUrl = (url) => (siteUrl ? { url } : {})
  const area = site.areaServed ? { areaServed: site.areaServed } : {}

  const services = [
    { key: 'pentest', name: t.pentest.eyebrow },
    { key: 'reverse', name: t.reverse.eyebrow },
    { key: 'dev', name: t.dev.eyebrow },
  ].map(({ key, name }) => ({
    '@type': 'Service',
    '@id': id(`service-${key}`),
    name,
    description: t.meta.services[key],
    provider: { '@id': id('person') },
    ...area,
  }))

  const graph = [
    {
      '@type': 'WebSite',
      '@id': id('website'),
      ...withUrl(`${siteUrl}/`),
      name: site.name,
      inLanguage: Object.keys(content),
      publisher: { '@id': id('person') },
    },
    {
      '@type': 'ProfilePage',
      '@id': siteUrl ? `${absolute(route)}#profilepage` : '#profilepage',
      ...withUrl(absolute(route)),
      name: t.meta.title,
      description: t.meta.description,
      inLanguage: route.lang,
      isPartOf: { '@id': id('website') },
      about: { '@id': id('person') },
      mainEntity: { '@id': id('person') },
    },
    {
      '@type': 'Person',
      '@id': id('person'),
      ...withUrl(`${siteUrl}/`),
      name: site.name,
      givenName: site.firstName,
      familyName: site.lastName,
      jobTitle: t.meta.jobTitle,
      description: t.meta.bio,
      email: site.email,
      sameAs: [site.linkedin],
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.locality,
        addressRegion: location.region[route.lang],
        addressCountry: location.country,
      },
      knowsAbout: t.meta.knowsAbout,
      award: t.meta.award,
      makesOffer: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@id': service['@id'] },
      })),
    },
    ...services,
  ]

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  JSON.parse(json)
  // « < » échappé : le JSON ne peut pas refermer la balise <script>.
  return `<script type="application/ld+json">${json.replace(/</g, '\\u003c')}</script>`
}

// ---------- <head> ----------

function headFor(route) {
  const t = content[route.lang]
  const { title, description } = pageMeta(route)
  const indexable = isIndexable(route)
  const isHome = route.page === 'home'
  const withImage = Boolean(siteUrl && hasOgImage)
  const prefix = rootRel(route)

  if (title.length > TITLE_MAX) {
    warn(`${route.id} : titre de ${title.length} caractères (maximum conseillé : ${TITLE_MAX}).`)
  }
  if (description.length > DESCRIPTION_MAX) {
    warn(
      `${route.id} : description de ${description.length} caractères (maximum conseillé : ${DESCRIPTION_MAX}).`,
    )
  }

  const tag = (name, attrs) =>
    `<${name} ${Object.entries(attrs)
      .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
      .join(' ')} />`
  const meta = (name, value) => tag('meta', { name, content: value })
  const og = (property, value) => tag('meta', { property, content: value })

  const lines = [`<title>${escapeHtml(title)}</title>`, meta('description', description)]
  if (!indexable) lines.push(meta('robots', 'noindex,follow'))

  if (siteUrl && indexable) {
    lines.push(tag('link', { rel: 'canonical', href: absolute(route) }))
    for (const other of alternatesOf(route)) {
      lines.push(tag('link', { rel: 'alternate', hreflang: other.lang, href: absolute(other) }))
    }
    lines.push(
      tag('link', { rel: 'alternate', hreflang: 'x-default', href: absolute(routeFor('fr', route.page)) }),
    )
  }

  lines.push(
    og('og:type', 'website'),
    og('og:site_name', site.name),
    og('og:title', isHome ? t.meta.ogTitle : title),
    og('og:description', isHome ? t.meta.ogDescription : description),
    og('og:locale', OG_LOCALE[route.lang]),
  )
  for (const other of alternatesOf(route)) {
    if (other.lang !== route.lang) lines.push(og('og:locale:alternate', OG_LOCALE[other.lang]))
  }
  if (siteUrl) lines.push(og('og:url', absolute(route)))
  if (withImage) {
    lines.push(
      og('og:image', `${siteUrl}/${OG_IMAGE.file}`),
      og('og:image:type', 'image/png'),
      og('og:image:width', OG_IMAGE.width),
      og('og:image:height', OG_IMAGE.height),
      og('og:image:alt', t.meta.ogImageAlt),
    )
  }
  lines.push(meta('twitter:card', withImage ? 'summary_large_image' : 'summary'))
  if (withImage) lines.push(meta('twitter:image', `${siteUrl}/${OG_IMAGE.file}`))

  for (const file of fontFiles) {
    if (!file) continue
    lines.push(
      tag('link', {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: `${prefix}assets/${file}`,
        crossorigin: true,
      }),
    )
  }

  if (isHome) lines.push(jsonLd(route))
  return lines.join('\n    ')
}

// ---------- Pages ----------

// Les fichiers du build sont référencés par « ./… » : une page rangée dans un
// sous-dossier remonte d'autant de niveaux.
const templateFor = (route) => template.replaceAll('="./', `="${rootRel(route)}`)

const written = []

for (const route of routes) {
  const markup = render(route)
  const html = templateFor(route)
    .replace(/<html lang="[^"]*">/, `<html lang="${route.lang}">`)
    .replace(HEAD_MARKER, () => headFor(route))
    .replace(ROOT_MARKER, () => `<div id="root" data-route="${route.id}">${markup}</div>`)

  if (!/<h1[\s>]/.test(markup)) fail(`${route.id} : aucun <h1> dans la page.`)
  if ((markup.match(/<h1[\s>]/g) ?? []).length > 1) fail(`${route.id} : plusieurs <h1> dans la page.`)
  if (/\bundefined\b/.test(html)) fail(`${route.id} : le texte "undefined" apparaît dans la page.`)
  if (/\[object Object\]/.test(html)) fail(`${route.id} : "[object Object]" apparaît dans la page.`)
  if (depth(route) > 0 && html.includes('="./assets/')) fail(`${route.id} : chemin d'asset non réécrit.`)

  const file = join(dist, route.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  written.push(`${route.path}index.html`)

  // Adresses de section (/pentest, /en/about…) : copies de l'accueil, dans le
  // même dossier que lui. Leur lien canonique désigne l'accueil et elles ne
  // figurent pas dans le sitemap : pas de contenu dupliqué pour les moteurs.
  if (route.page === 'home') {
    for (const section of sections) {
      const name = `${sectionPath(route.lang, section.id)}.html`
      await writeFile(join(dist, name), html)
      written.push(name)
    }
  }
}

// ---------- robots.txt ----------

function robotsTxt() {
  const training = AI_TRAINING === 'allow' ? 'Allow: /' : 'Disallow: /'
  const lines = [
    `# robots.txt : ${site.name}`,
    '# Tout le site est ouvert aux moteurs de recherche et aux assistants IA',
    '# qui citent leurs sources.',
    AI_TRAINING === 'allow'
      ? "# Les robots d'entraînement de modèles d'IA sont également autorisés."
      : "# Les robots d'entraînement de modèles d'IA sont refusés.",
    '# Réglage : seo.config.mjs (AI_TRAINING).',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Recherche et réponses à la demande',
    ...SEARCH_BOTS.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    "# Entraînement de modèles d'IA",
    ...TRAINING_BOTS.map((bot) => `User-agent: ${bot}`),
    training,
  ]
  if (siteUrl) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
  return `${lines.join('\n')}\n`
}

await writeFile(join(dist, 'robots.txt'), robotsTxt())
written.push('robots.txt')

// ---------- llms.txt ----------

function llmsTxt() {
  const { fr, en } = content
  const { location } = site
  const lines = [
    `# ${site.name}`,
    '',
    `> ${en.meta.bio}`,
    '',
    fr.meta.bio,
    '',
    '## Key facts',
    '',
    `- Role: ${en.meta.jobTitle}`,
    `- Services: ${[en.pentest.eyebrow, en.reverse.eyebrow, en.dev.eyebrow].join('; ')}`,
    ...en.meta.keyFacts.map(([key, text]) => `- ${key}: ${text}`),
    `- Hall of Fame: ${site.hallOfFame}`,
    `- Location: ${[location.locality, location.department, location.region.en, location.countryName.en].join(', ')}`,
    `- Site languages: ${Object.values(site.languages).join(', ')}`,
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.linkedin}`,
  ]
  if (siteUrl) {
    lines.push('', '## Pages', '')
    for (const route of routes.filter(isIndexable)) {
      const { title, description } = pageMeta(route)
      lines.push(`- [${title}](${absolute(route)}): ${description}`)
    }
  }
  // Fichier lu par des machines : espaces simples à la place des insécables.
  return `${lines.join('\n')}\n`.replaceAll('\u00a0', ' ')
}

await writeFile(join(dist, 'llms.txt'), llmsTxt())
written.push('llms.txt')

// ---------- sitemap.xml et 404.html (adresse du site connue) ----------

function sitemapXml() {
  const urls = routes.filter(isIndexable).map((route) => {
    const links = alternatesOf(route)
      .filter(isIndexable)
      .map(
        (other) =>
          `    <xhtml:link rel="alternate" hreflang="${other.lang}" href="${escapeHtml(absolute(other))}" />`,
      )
    links.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(absolute(routeFor('fr', route.page)))}" />`,
    )
    return ['  <url>', `    <loc>${escapeHtml(absolute(route))}</loc>`, ...links, '  </url>'].join('\n')
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

// Une page 404 peut être servie depuis n'importe quelle adresse : tous ses
// liens sont absolus, et elle n'embarque pas le script de l'application.
function notFoundHtml() {
  const { meta } = content.fr
  const title = `${meta.notFoundTitle} / ${content.en.meta.notFoundTitle.split(' | ')[1]}`
  const markup = renderNotFound({
    fr: absolute(routeFor('fr', 'home')),
    en: absolute(routeFor('en', 'home')),
  })
  const html = template
    .replaceAll('="./', `="${siteUrl}/`)
    .replace(/\s*<script type="module"[^>]*><\/script>/g, '')
    .replace(/\s*<link rel="modulepreload"[^>]*>/g, '')
    .replace(
      HEAD_MARKER,
      () => `<title>${escapeHtml(title)}</title>\n    <meta name="robots" content="noindex,follow" />`,
    )
    .replace(ROOT_MARKER, () => `<div id="root">${markup}</div>`)
  if (html.includes('<script type="module"'))
    fail("404.html : le script de l'application est encore présent.")
  return html
}

if (siteUrl) {
  await writeFile(join(dist, 'sitemap.xml'), sitemapXml())
  await writeFile(join(dist, '404.html'), notFoundHtml())
  written.push('sitemap.xml', '404.html')
} else {
  // Un build précédent a pu en laisser : sans adresse, ils seraient faux.
  await rm(join(dist, 'sitemap.xml'), { force: true })
  await rm(join(dist, '404.html'), { force: true })
}

// ---------- Nettoyage et compte rendu ----------

await rm(distSsr, { recursive: true, force: true })
await rm(join(dist, '.DS_Store'), { force: true })

console.log(`\n[prerender] ${written.length} fichiers écrits dans dist/ :`)
for (const file of written) console.log(`  - ${file}`)

for (const route of routes) {
  if (!isIndexable(route)) {
    warn(
      `${route.id} : mentions légales incomplètes ("à compléter" dans src/content.js) → page en noindex et absente du sitemap.`,
    )
  }
}

if (!siteUrl) {
  console.warn(
    [
      '',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      "!!  SITE_URL n'est pas renseignée (seo.config.mjs).",
      '!!  Le site fonctionne, mais ces éléments ont été omis :',
      '!!    - lien canonique et balises hreflang (fr / en / x-default)',
      "!!    - og:url, og:image et twitter:image (aperçu lors d'un partage)",
      '!!    - sitemap.xml et la ligne « Sitemap: » de robots.txt',
      '!!    - url et identifiants absolus des données structurées (JSON-LD)',
      '!!    - section « Pages » de llms.txt',
      '!!    - 404.html',
      '!!  Avant la mise en ligne :  SITE_URL=https://votre-domaine bun run build',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ].join('\n'),
  )
}

if (warnings.length > 0) {
  console.warn('\n[prerender] avertissements :')
  for (const message of warnings) console.warn(`  - ${message}`)
}
console.log('')
