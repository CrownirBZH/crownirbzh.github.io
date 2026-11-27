// Réglages de référencement. Ce fichier n'est lu que par scripts/prerender.mjs
// pendant `bun run build` ; il n'est jamais envoyé au navigateur.

// Adresse publique du site, en https, sans « / » final.
//   à la racine d'un domaine :  'https://www.exemple.fr'
//   dans un sous-dossier :      'https://exemple.fr/site'
//
// Deux façons de la renseigner :
//   - modifier l'adresse ci-dessous ;
//   - ou la passer au moment du build :  SITE_URL=https://www.exemple.fr bun run build
//
// Tant qu'elle est vide, le build fonctionne mais n'écrit rien qui contienne
// un nom de domaine : pas de lien canonique, pas de hreflang, pas d'image de
// partage, pas de sitemap.xml, pas de 404.html.
export const SITE_URL = process.env.SITE_URL ?? 'https://hacquet.com'

// Robots d'entraînement de modèles d'IA (GPTBot, ClaudeBot, Google-Extended,
// CCBot, Applebot-Extended) :
//   'allow'    : autorisés (réglage actuel)
//   'disallow' : refusés
// Les robots de recherche et de réponse (Googlebot, Bingbot, OAI-SearchBot,
// ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot…) restent
// autorisés dans les deux cas.
export const AI_TRAINING = process.env.AI_TRAINING ?? 'allow'
