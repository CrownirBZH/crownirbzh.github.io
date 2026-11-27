# Site de Camille HACQUET

Site vitrine en français et en anglais (Vite + React). `bun run build` produit un dossier `dist/` entièrement statique : chaque page est un vrai fichier HTML, lisible sans JavaScript par les moteurs de recherche et les assistants IA.

## Commandes

| Commande          | Rôle                                                                              |
| ----------------- | --------------------------------------------------------------------------------- |
| `bun install`     | Installe les dépendances (une seule fois).                                        |
| `bun run dev`     | Site en local avec rechargement à chaud.                                          |
| `bun run build`   | Génère le site dans `dist/`.                                                      |
| `bun run preview` | Sert `dist/` en local pour vérifier le résultat du build.                         |
| `bun run lint`    | Vérifie le code.                                                                  |
| `bun run og`      | Régénère l'image de partage `public/og.png` à partir de `scripts/og.svg` (macOS). |
| `bun run icons`   | Régénère les icônes PNG à partir de `public/favicon.svg` (macOS).                 |

## Pages générées

| Adresse              | Fichier                            | Langue   |
| -------------------- | ---------------------------------- | -------- |
| `/`                  | `dist/index.html`                  | français |
| `/en/`               | `dist/en/index.html`               | anglais  |
| `/mentions-legales/` | `dist/mentions-legales/index.html` | français |
| `/en/legal-notice/`  | `dist/en/legal-notice/index.html`  | anglais  |

Le build écrit aussi `robots.txt` et `llms.txt`, puis `sitemap.xml` et `404.html` une fois l'adresse du site renseignée. La liste des pages se trouve dans `src/routes.js`.

## Adresse du site (à renseigner avant la mise en ligne)

L'adresse se règle à un seul endroit, `seo.config.mjs` :

```js
export const SITE_URL = process.env.SITE_URL ?? 'https://hacquet.com'
```

Deux possibilités :

- remplacer `''` par l'adresse, en `https` et sans `/` final, par exemple `'https://www.exemple.fr'` ;
- ou la passer au moment du build : `SITE_URL=https://www.exemple.fr bun run build`.

Tant qu'elle est vide, le build fonctionne et affiche un avertissement. Les éléments suivants ne sont pas générés, car ils exigent une adresse complète :

- lien canonique et balises `hreflang` ;
- `og:url`, image de partage (`og:image`, `twitter:image`) ;
- `sitemap.xml` et la ligne `Sitemap:` de `robots.txt` ;
- adresses dans les données structurées (JSON-LD) et section « Pages » de `llms.txt` ;
- `404.html`.

Le même fichier contient `AI_TRAINING` (`'allow'` ou `'disallow'`), qui autorise ou refuse dans `robots.txt` les robots d'entraînement de modèles d'IA (GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended). Les robots de recherche restent autorisés dans les deux cas.

## Modifier les textes

Tout le texte du site, dans les deux langues, se trouve dans `src/content.js` :

- `site` : nom, email, LinkedIn, et `location` (ville, département, région). Changer la ville ici la change partout : textes, balises `<title>` et description, données structurées, `llms.txt`.
- `site.areaServed` : zone d'intervention, laissée à `null` pour l'instant.
- `content.fr` et `content.en` : les textes de chaque section. `meta` regroupe les titres et descriptions destinés aux moteurs de recherche (65 caractères au plus pour un titre, 160 pour une description ; le build avertit en cas de dépassement).
- `faq.items` : questions affichées sur la page d'accueil.
- `faqDrafts` (fin du fichier) : réponses en attente de validation. Elles ne sont ni affichées ni publiées. Pour en publier une, la déplacer dans `faq.items` de la bonne langue et retirer `draft: true`.
- `legal.sections` : mentions légales. Tant qu'un champ vaut `TODO` (« à compléter »), les deux pages de mentions légales portent `noindex` et sont absentes du sitemap. Cela se lève automatiquement une fois tous les champs remplis.

Après une modification : `bun run build`.

## Déployer `dist/`

1. Vérifier `SITE_URL` (actuellement `https://hacquet.com`), puis lancer `bun run build`.
2. Envoyer **le contenu** de `dist/` à la racine du site chez l'hébergeur (hébergement statique : aucun serveur Node n'est nécessaire).

Réglages à vérifier chez l'hébergeur :

- les dossiers servent leur `index.html` (`/en/` renvoie `en/index.html`) ;
- `/en` redirige vers `/en/` (comportement par défaut de la plupart des hébergeurs) ;
- **pas** de règle de type « application monopage » qui renvoie `index.html` pour toute adresse inconnue : une adresse inexistante doit répondre 404 (avec `404.html`) ;
- `robots.txt` et `llms.txt` ne sont pris en compte qu'à la racine du domaine ;
- ne pas activer de protection anti-robots qui bloquerait les robots de recherche ou d'IA.

Le site fonctionne aussi dans un sous-dossier (les liens internes sont relatifs) : indiquer alors le sous-dossier dans `SITE_URL`, par exemple `https://exemple.fr/site`.

## Organisation du code

- `index.html` : gabarit commun à toutes les pages.
- `src/App.jsx`, `src/components/` : mise en page.
- `src/index.css` : styles.
- `src/routes.js` : liste des pages et liens entre elles.
- `src/main.jsx` : démarrage dans le navigateur. `src/entry-server.jsx` : rendu pendant le build.
- `scripts/prerender.mjs` : écrit les fichiers HTML, `robots.txt`, `llms.txt`, `sitemap.xml` et `404.html`.
- `public/` : fichiers copiés tels quels (icônes, image de partage).

## Adresses des sections

Les liens du menu n'utilisent pas d'ancre `#`. Chaque section de l'accueil a sa propre adresse : `/pentest`, `/retro-ingenierie`, `/developpement`, `/a-propos`, `/faq`, `/contact` (et `/en/pentest`, `/en/reverse-engineering`, etc.). La liste est dans `src/routes.js` (`sections`).

Au build, chaque adresse reçoit une copie de la page d'accueil (`pentest.html`, etc.). Son lien canonique désigne l'accueil et elle est absente du sitemap, pour éviter le contenu dupliqué.

## Déploiement : GitLab vers GitHub Pages

Le code vit sur le GitLab auto-hébergé (`git.ato.eus:bzh/website`). Le site est servi par GitHub Pages. Le lien entre les deux est un miroir : GitLab recopie le dépôt vers GitHub à chaque push, et l'action `.github/workflows/deploy.yml` y construit puis publie le site.

Mise en place, à faire une seule fois :

1. **GitHub** : créer un dépôt vide (sans README). Sur l'offre gratuite, GitHub Pages demande un dépôt public : le code source y sera donc visible.
2. **GitHub** : créer un jeton d'accès limité à ce dépôt, avec le droit « Contents : Read and write » et le droit « Workflows : Read and write » (sans ce dernier, GitHub refuse les pushs qui touchent `.github/workflows/`).
3. **GitLab** : Settings > Repository > Mirroring repositories. Adresse `https://github.com/<utilisateur>/<depot>.git`, direction « Push », authentification par nom d'utilisateur GitHub et jeton.
4. **GitHub** : Settings > Pages > Build and deployment > Source : « GitHub Actions ».
5. **GitHub** : Settings > Pages > Custom domain : `hacquet.com`. Avec un déploiement par action, c'est ce réglage qui compte ; le fichier `public/CNAME` n'est pas lu.
6. **Cloudflare** : faire pointer le domaine vers GitHub Pages (enregistrement `CNAME` vers `<utilisateur>.github.io`, ou les adresses IP de GitHub Pages pour le domaine nu).

Ensuite, un `git push` vers GitLab suffit : le miroir se déclenche tout seul (ou par le bouton de synchronisation de la même page), puis l'action GitHub publie en une à deux minutes. L'action lance aussi `bun run lint` : un push qui ne passe pas le lint n'est pas publié.

## Outils

- **Bun** : gestionnaire de paquets, lanceur de commandes et moteur d'exécution (`bun install`, `bun run dev`, `bun run build`, `bun run preview`). Vite et le script de prérendu tournent sous Bun.
- **Biome** : formatage et lint (`bun run lint` pour vérifier, `bun run format` pour corriger). Réglages dans `biome.json`.
