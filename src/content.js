// Tout le texte du site, en français et en anglais.
// Modifier ce fichier suffit pour changer le contenu.
// Dans les textes français, « \u00a0 » est une espace insécable : elle empêche
// qu'un « : », « ; », « ? » ou « ! » se retrouve seul en début de ligne.

// Lieu d'implantation actuel. Source unique : tous les textes ci-dessous,
// les balises <meta>, les données structurées et llms.txt le lisent ici.
// En cas de déménagement, il suffit de modifier ce bloc.
const place = {
  locality: 'Lannion',
  department: "Côtes-d'Armor",
  region: { fr: 'Bretagne', en: 'Brittany' },
  country: 'FR',
  countryName: { fr: 'France', en: 'France' },
}

export const site = {
  firstName: 'Camille',
  lastName: 'HACQUET',
  name: 'Camille HACQUET',
  email: 'camille@hacquet.com',
  linkedin: 'https://www.linkedin.com/in/camille-hacquet/',
  hallOfFame: 'https://www.swile.co/security/hall-of-fame.txt',
  // Fiche officielle de l'entreprise (Annuaire des Entreprises, data.gouv.fr).
  companyRegistry: 'https://annuaire-entreprises.data.gouv.fr/entreprise/camille-hacquet-989814926',
  languages: { fr: 'Français', en: 'English' },
  location: place,
  // Zone d'intervention (ex. 'France'). Tant que la valeur est null,
  // rien n'est annoncé dans les données structurées.
  areaServed: null,
}

// Valeur affichée tant qu'une information légale n'a pas été renseignée.
export const TODO = null

export const content = {
  fr: {
    meta: {
      // Balise <title> : 65 caractères au plus. Description : 160 au plus.
      title: `Camille HACQUET | Pentester freelance API & mobile, ${place.locality}`,
      description: `Camille HACQUET, pentester freelance à ${place.locality} (${place.region.fr})\u00a0: tests d'intrusion API, mobile et web, rétro-ingénierie Android, développement d'API NestJS.`,
      legalTitle: 'Camille HACQUET | Mentions légales',
      legalDescription:
        'Mentions légales du site de Camille HACQUET, pentester et développeur backend freelance\u00a0: éditeur, hébergement, propriété intellectuelle, données personnelles.',
      // Aperçu affiché lors d'un partage (LinkedIn, messageries…).
      ogTitle: 'Camille HACQUET | Pentester & développeur backend freelance',
      ogDescription:
        "Tests d'intrusion API, mobile et web, rétro-ingénierie, développement d'API Node.js / NestJS.",
      ogImageAlt: 'Camille HACQUET | Pentest API, mobile et web, rétro-ingénierie, développement backend',
      notFoundTitle: 'Camille HACQUET | Page introuvable',
      // Données structurées (schema.org), invisibles sur la page.
      jobTitle: 'Pentester et développeur backend freelance',
      bio: `Camille HACQUET est pentester et développeur backend freelance, basé à ${place.locality} (${place.department}, ${place.region.fr}). Il réalise principalement des tests d'intrusion d'API et d'applications mobiles, ainsi que d'applications web.`,
      award: 'Hall of Fame sécurité de Swile',
      knowsAbout: [
        "Tests d'intrusion",
        'Sécurité des API',
        'Sécurité des applications mobiles',
        'Sécurité des applications web',
        'Rétro-ingénierie',
        'Android',
        'Node.js',
        'NestJS',
        'Bug bounty',
      ],
      services: {
        pentest: "Tests d'intrusion d'API, d'applications mobiles et d'applications web.",
        reverse: "Rétro-ingénierie d'applications Android, web et natives.",
        dev: "Développement d'API backend en Node.js / NestJS.",
      },
    },
    nav: {
      pentest: 'Pentest',
      reverse: 'Rétro-ingénierie',
      dev: 'Développement',
      about: 'À propos',
      cta: 'Me contacter',
      langLabel: 'Langue',
      home: "Retour à l'accueil",
      label: 'Navigation principale',
      skip: 'Aller au contenu',
      // Textes lus par les lecteurs d'écran, invisibles à l'écran.
      homeLabel: 'Camille HACQUET, accueil',
      newWindow: '(nouvelle fenêtre)',
      sep: '\u00a0: ',
    },
    hero: {
      eyebrow: 'Pentester freelance à Lannion',
      title: [
        'Faites tester vos API et vos applications mobiles',
        "avant que les attaquants ne s'en chargent.",
      ],
      lead: 'Pentester, développeur backend et bug hunter\u00a0: je trouve vos failles et vous donne de quoi les corriger.',
      primary: 'Décrire votre projet par email',
      secondary: 'Voir mon LinkedIn',
      terminalAlt:
        "Illustration\u00a0: décompilation d'une application Android, contournement de l'épinglage de certificat, puis accès aux données d'un autre utilisateur par l'API.",
      terminal: [
        { kind: 'cmd', text: 'jadx -d out/ app-release.apk' },
        { kind: 'ok', text: '[+] sources décompilées' },
        { kind: 'cmd', text: 'frida -U -f com.example.app -l unpin.js' },
        { kind: 'ok', text: '[+] certificate pinning contourné' },
        { kind: 'cmd', text: 'curl -H "Authorization: Bearer $TOKEN_A" \\' },
        { kind: 'cont', text: 'https://api.example.com/v2/users/B/orders' },
        { kind: 'out', text: 'HTTP/2 200', note: '(devrait être 403)' },
        { kind: 'alert', text: "[!] BOLA\u00a0: accès aux données d'un autre utilisateur" },
      ],
    },
    facts: [
      {
        value: 'Transports',
        label: "tests d'intrusion menés dans le secteur des transports en commun",
      },
      {
        value: '3 ans',
        label: "de développement d'API Node.js / NestJS en entreprise",
      },
      {
        value: 'Bug bounty',
        label: 'chasseur actif, cité au',
        link: true,
        linkLabel: 'Hall of Fame sécurité de Swile',
      },
    ],
    pentest: {
      eyebrow: "Tests d'intrusion API, mobile et web",
      cta: 'Décrire votre périmètre par email',
      title: "Trouver ce qu'un attaquant trouverait, et vous l'expliquer.",
      lead: 'Mon terrain de prédilection\u00a0: les API et les applications mobiles qui les consomment. Chaque mission se termine par un rapport dont vos développeurs peuvent rejouer chaque faille, puis la corriger.',
      cards: [
        {
          title: "Pentest d'API",
          text: "Authentification, contrôle d'accès, logique métier, exposition de données. Là où se cachent les failles qu'aucun scanner ne voit.",
        },
        {
          title: "Pentest d'applications mobiles",
          text: "Analyse statique et dynamique de l'application, de son stockage local, de ses échanges réseau et de la solidité de ses protections.",
        },
        {
          title: "Pentest d'applications web",
          text: 'Front, back et sessions\u00a0: injections, XSS, défauts de cloisonnement entre comptes, erreurs de configuration.',
        },
      ],
    },
    reverse: {
      eyebrow: 'Rétro-ingénierie Android, web et applications natives',
      title: 'Comprendre ce que fait vraiment une application.',
      lead: "C'est ma passion, et souvent le point de départ de mes meilleures trouvailles\u00a0: démonter une application pour voir ce qu'elle embarque, ce qu'elle protège, et comment elle parle à son serveur. Vous savez ainsi ce qu'un attaquant peut en extraire et ce que valent réellement vos protections.",
      items: [
        {
          title: 'Rétro-ingénierie Android',
          text: "Décompilation, analyse du code et instrumentation à chaud pour observer et modifier le comportement réel de l'application.",
        },
        {
          title: 'Web',
          text: 'JavaScript minifié ou obfusqué, API privées et protocoles maison\u00a0: reconstituer ce que le navigateur exécute.',
        },
        {
          title: 'Applications natives',
          text: 'Analyse de binaires et de bibliothèques natives, là où se logent la cryptographie et les contrôles sensibles.',
        },
      ],
    },
    dev: {
      eyebrow: "Développement d'API Node.js / NestJS",
      title: "Des API conçues par quelqu'un qui passe son temps à en casser.",
      lead: 'Développeur backend spécialisé Node.js et NestJS, je conçois et développe des API avec la sécurité intégrée dès le départ, et non ajoutée après coup.',
      items: [
        {
          title: "Conception et développement d'API",
          text: "Conception et développement d'API backend en Node.js / NestJS.",
        },
        {
          title: 'API à fort trafic',
          text: "Trois ans de développement d'API scalables, très sollicitées en production.",
        },
        {
          title: 'Sécurité dès la conception',
          text: "Authentification, contrôle d'accès et validation des entrées pensés avec les réflexes d'un attaquant.",
        },
      ],
      stack: ['Node.js', 'NestJS', 'REST'],
    },
    why: {
      title: 'Pourquoi travailler avec moi\u00a0?',
      cta: 'Parler de votre mission',
      cards: [
        {
          title: 'Un seul interlocuteur',
          text: 'Vous échangez directement avec la personne qui cadre la mission, réalise les tests et rédige le rapport.',
        },
        {
          title: "Le regard d'un développeur",
          text: 'Des vulnérabilités reproductibles et des recommandations qui tiennent compte de la réalité de votre code.',
        },
        {
          title: "L'habitude du terrain",
          text: "Le bug bounty m'a appris à chercher sur des cibles réelles, déjà auditées, où les failles évidentes ont disparu.",
        },
        {
          title: 'Prestations sur mesure',
          text: "Périmètre, durée et niveau d'information (boîte noire, grise ou blanche) sont définis avec vous, selon votre contexte et vos contraintes.",
        },
      ],
    },
    about: {
      eyebrow: 'À propos',
      title: 'Camille HACQUET',
      // Premier paragraphe de la section, à la première personne comme le
      // reste du site. La version à la troisième personne (meta.bio) ne sert
      // qu'aux données structurées et à llms.txt, invisibles sur la page.
      intro: `Je suis pentester et développeur backend freelance, basé à ${place.locality} (${place.department}, ${place.region.fr}). Je réalise principalement des tests d'intrusion d'API et d'applications mobiles, ainsi que d'applications web.`,
      paragraphs: [
        "Trois ans de développement d'API Node.js / NestJS en entreprise, scalables et à fort trafic en production, m'ont appris comment elles sont construites\u00a0; le pentest et le bug bounty, comment elles cèdent.",
        "Je pratique beaucoup le bug bounty. J'ai mené des tests d'intrusion dans le secteur des transports en commun.",
        "Ce qui m'anime le plus\u00a0: la rétro-ingénierie, sur Android, sur le web comme sur des applications natives.",
      ],
      linkedin: 'Profil LinkedIn',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      // Seules les entrées sans `draft: true` sont affichées.
      items: [
        {
          q: "Quels types de tests d'intrusion réalisez-vous\u00a0?",
          a: "Principalement des tests d'intrusion d'API et d'applications mobiles, ainsi que d'applications web. La rétro-ingénierie (Android, web, applications natives) fait partie de ma démarche.",
        },
        {
          q: 'Faites-vous aussi du développement\u00a0?',
          a: "Oui. Je suis développeur backend, spécialisé dans les API\u00a0: j'ai trois ans de développement d'API Node.js / NestJS en entreprise, scalables et à fort trafic en production.",
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Un périmètre à tester, une API à construire\u00a0?',
      lead: 'Décrivez-moi votre contexte en quelques lignes\u00a0: je reviens vers vous pour en discuter.',
      email: 'Écrire un email',
      linkedin: 'Me contacter sur LinkedIn',
      subject: "Projet de pentest ou de développement d'API",
      // Corps pré-rempli de l'email : quelques questions pour cadrer la demande.
      body: [
        'Bonjour,',
        '',
        'Voici mon besoin en quelques lignes.',
        '',
        'Type de prestation (pentest API, mobile, web, rétro-ingénierie, développement)\u00a0:',
        'Périmètre (application, environnement, taille approximative)\u00a0:',
        'Échéance souhaitée\u00a0:',
        'Société et fonction\u00a0:',
      ],
    },
    footer: {
      tagline: `Pentest, rétro-ingénierie et développement backend. Basé à ${place.locality}, ${place.region.fr}.`,
      rights: 'Tous droits réservés.',
      legal: 'Mentions légales',
      sections: 'Sections du site',
    },
    notFound: {
      title: 'Page introuvable',
      text: "Cette page n'existe pas ou a été déplacée.",
      home: "Retour à l'accueil",
    },
    legal: {
      title: 'Mentions légales',
      todo: 'à compléter',
      sections: [
        {
          title: 'Éditeur du site',
          rows: [
            ['Nom', 'Camille HACQUET'],
            ['Statut', 'Entrepreneur individuel'],
            ['SIRET', '989 814 926 00014', site.companyRegistry, ", fiche sur l'Annuaire des Entreprises"],
            ['Assurance', 'Responsabilité civile professionnelle\u00a0: AXA France IARD, couverture France'],
            ['Email', site.email],
            ['Directeur de la publication', 'Camille HACQUET'],
          ],
        },
        {
          title: 'Hébergement',
          rows: [
            ['Hébergeur', 'GitHub Pages (GitHub, Inc.)'],
            ['Adresse', '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis'],
            ['Diffusion', 'Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis'],
          ],
        },
        {
          title: 'Propriété intellectuelle',
          text: "L'ensemble des contenus de ce site (textes, éléments graphiques, code) est la propriété de Camille HACQUET, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.",
        },
        {
          title: 'Données personnelles',
          text: "Ce site ne dépose aucun cookie et n'utilise aucun outil de mesure d'audience\u00a0; l'hébergeur et le réseau de diffusion peuvent conserver des journaux techniques de connexion. Si vous me contactez par email, vos informations ne servent qu'à vous répondre.",
        },
      ],
    },
  },

  en: {
    meta: {
      title: `Camille HACQUET | Freelance API & mobile pentester, ${place.countryName.en}`,
      description: `Camille HACQUET, freelance pentester in ${place.locality}, ${place.region.en}: API, mobile and web penetration testing, Android reverse engineering, NestJS API development.`,
      legalTitle: 'Camille HACQUET | Legal notice',
      legalDescription:
        'Legal notice for the website of Camille HACQUET, freelance pentester and backend developer: publisher, hosting, intellectual property and personal data.',
      ogTitle: 'Camille HACQUET | Freelance pentester & backend developer',
      ogDescription:
        'API, mobile and web penetration testing, reverse engineering, Node.js / NestJS API development.',
      ogImageAlt: 'Camille HACQUET | API, mobile and web pentest, reverse engineering, backend development',
      notFoundTitle: 'Camille HACQUET | Page not found',
      jobTitle: 'Freelance pentester and backend developer',
      bio: `Camille HACQUET is a freelance pentester and backend developer based in ${place.locality}, ${place.region.en}, ${place.countryName.en}. He mainly performs API and mobile application penetration tests, and also web application tests.`,
      // Lignes « Key facts » de llms.txt : des phrases explicites, lisibles
      // hors contexte (llms.txt n'est publié qu'en anglais).
      keyFacts: [
        [
          'Main activity',
          'penetration testing, mostly of APIs and mobile applications, and also of web applications',
        ],
        [
          'Development experience',
          '3 years of Node.js / NestJS API development in a company, on scalable, high-traffic production APIs',
        ],
        ['Bug bounty', "active bug bounty hunter, listed in Swile's security Hall of Fame"],
        ['Sector experience', 'penetration tests carried out in the public transport sector'],
      ],
      award: 'Swile security Hall of Fame',
      knowsAbout: [
        'Penetration testing',
        'API security',
        'Mobile application security',
        'Web application security',
        'Reverse engineering',
        'Android',
        'Node.js',
        'NestJS',
        'Bug bounty',
      ],
      services: {
        pentest: 'Penetration testing of APIs, mobile applications and web applications.',
        reverse: 'Reverse engineering of Android, web and native applications.',
        dev: 'Backend API development with Node.js / NestJS.',
      },
    },
    nav: {
      pentest: 'Pentest',
      reverse: 'Reverse engineering',
      dev: 'Development',
      about: 'About',
      cta: 'Get in touch',
      langLabel: 'Language',
      home: 'Back to home',
      label: 'Main navigation',
      skip: 'Skip to content',
      homeLabel: 'Camille HACQUET, home',
      newWindow: '(new window)',
      sep: ': ',
    },
    hero: {
      eyebrow: 'Freelance pentester in Lannion, Brittany',
      title: ['Get your APIs and mobile apps tested', 'before attackers get to them.'],
      lead: 'Pentester, backend developer and bug hunter: I find your flaws and give you what you need to fix them.',
      primary: 'Describe your project by email',
      secondary: 'View my LinkedIn',
      terminalAlt:
        "Illustration: decompiling an Android app, bypassing certificate pinning, then reaching another user's data through the API.",
      terminal: [
        { kind: 'cmd', text: 'jadx -d out/ app-release.apk' },
        { kind: 'ok', text: '[+] sources decompiled' },
        { kind: 'cmd', text: 'frida -U -f com.example.app -l unpin.js' },
        { kind: 'ok', text: '[+] certificate pinning bypassed' },
        { kind: 'cmd', text: 'curl -H "Authorization: Bearer $TOKEN_A" \\' },
        { kind: 'cont', text: 'https://api.example.com/v2/users/B/orders' },
        { kind: 'out', text: 'HTTP/2 200', note: '(should be 403)' },
        { kind: 'alert', text: "[!] BOLA: access to another user's data" },
      ],
    },
    facts: [
      {
        value: 'Transport',
        label: 'penetration tests carried out in the public transport sector',
      },
      {
        value: '3 years',
        label: 'building Node.js / NestJS APIs in a company setting',
      },
      {
        value: 'Bug bounty',
        label: 'active hunter, listed in',
        link: true,
        linkLabel: "Swile's security Hall of Fame",
      },
    ],
    pentest: {
      eyebrow: 'API, mobile and web penetration testing',
      cta: 'Describe your scope by email',
      title: 'Find what an attacker would find, and explain it to you.',
      lead: 'My home turf: APIs and the mobile apps that consume them. Every engagement ends with a report whose findings your developers can reproduce and fix.',
      cards: [
        {
          title: 'API pentesting',
          text: 'Authentication, access control, business logic, data exposure. Where the flaws no scanner sees are hiding.',
        },
        {
          title: 'Mobile app pentesting',
          text: 'Static and dynamic analysis of the app, its local storage, its network traffic and the strength of its protections.',
        },
        {
          title: 'Web app pentesting',
          text: 'Front end, back end and sessions: injections, XSS, broken isolation between accounts, misconfigurations.',
        },
      ],
    },
    reverse: {
      eyebrow: 'Android, web and native app reverse engineering',
      title: 'Understand what an application really does.',
      lead: "It's my passion, and often where my best findings start: taking an app apart to see what it ships, what it protects, and how it talks to its server. You then know what an attacker can extract from it and what your protections are really worth.",
      items: [
        {
          title: 'Android reverse engineering',
          text: "Decompilation, code analysis and live instrumentation to observe and alter the app's real behaviour.",
        },
        {
          title: 'Web',
          text: 'Minified or obfuscated JavaScript, private APIs and home-grown protocols: rebuilding what the browser runs.',
        },
        {
          title: 'Native apps',
          text: 'Analysis of binaries and native libraries, where cryptography and sensitive checks tend to live.',
        },
      ],
    },
    dev: {
      eyebrow: 'Node.js / NestJS API development',
      title: 'APIs built by someone who spends his time breaking them.',
      lead: 'A backend developer specialised in Node.js and NestJS, I design and build APIs with security built in from the start, not bolted on afterwards.',
      items: [
        {
          title: 'API design and development',
          text: 'Backend API design and development in Node.js / NestJS.',
        },
        {
          title: 'High-traffic APIs',
          text: 'Three years building scalable APIs under heavy production traffic.',
        },
        {
          title: 'Security by design',
          text: "Authentication, access control and input validation designed with an attacker's reflexes.",
        },
      ],
      stack: ['Node.js', 'NestJS', 'REST'],
    },
    why: {
      title: 'Why work with me?',
      cta: 'Talk about your engagement',
      cards: [
        {
          title: 'One point of contact',
          text: 'You talk directly to the person who scopes the engagement, runs the tests and writes the report.',
        },
        {
          title: "A developer's eye",
          text: 'Reproducible vulnerabilities and recommendations that account for the reality of your codebase.',
        },
        {
          title: 'Field experience',
          text: 'Bug bounty taught me to hunt on real, already-audited targets where the obvious flaws are long gone.',
        },
        {
          title: 'Tailored engagements',
          text: 'Scope, duration and level of information (black, grey or white box) are defined with you, to fit your context and constraints.',
        },
      ],
    },
    about: {
      eyebrow: 'About',
      title: 'Camille HACQUET',
      intro: `I am a freelance pentester and backend developer based in ${place.locality}, ${place.region.en}, ${place.countryName.en}. I mainly carry out API and mobile application penetration tests, and also web application tests.`,
      paragraphs: [
        'Three years of building scalable, high-traffic Node.js / NestJS APIs in production at a company taught me how they are put together; pentesting and bug bounty taught me how they give way.',
        'I do a lot of bug bounty. I have carried out penetration tests in the public transport sector.',
        'What drives me most: reverse engineering, on Android, on the web and on native applications.',
      ],
      linkedin: 'LinkedIn profile',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        {
          q: 'What kinds of penetration tests do you carry out?',
          a: 'Mainly API and mobile application penetration tests, and also web application tests. Reverse engineering (Android, web, native applications) is part of my approach.',
        },
        {
          q: 'Do you also do development work?',
          a: 'Yes. I am a backend developer specialised in APIs, with three years of building scalable, high-traffic Node.js / NestJS APIs in production at a company.',
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'A scope to test, an API to build?',
      lead: "Tell me about your context in a few lines and I'll get back to you to discuss it.",
      email: 'Send an email',
      linkedin: 'Reach me on LinkedIn',
      subject: 'Pentest or API development project',
      body: [
        'Hello,',
        '',
        'Here is what I need, in a few lines.',
        '',
        'Type of work (API, mobile or web pentest, reverse engineering, development):',
        'Scope (application, environment, rough size):',
        'Preferred timeframe:',
        'Company and role:',
      ],
    },
    footer: {
      tagline: `Pentest, reverse engineering and backend development. Based in ${place.locality}, ${place.region.en} (${place.countryName.en}).`,
      rights: 'All rights reserved.',
      legal: 'Legal notice',
      sections: 'Site sections',
    },
    notFound: {
      title: 'Page not found',
      text: 'This page does not exist or has been moved.',
      home: 'Back to home',
    },
    legal: {
      title: 'Legal notice',
      todo: 'to be completed',
      sections: [
        {
          title: 'Publisher',
          rows: [
            ['Name', 'Camille HACQUET'],
            ['Legal status', 'Sole proprietor'],
            ['SIRET', '989 814 926 00014', site.companyRegistry, ', record in the French company register'],
            ['Insurance', 'Professional liability: AXA France IARD, coverage in France'],
            ['Email', site.email],
            ['Publication director', 'Camille HACQUET'],
          ],
        },
        {
          title: 'Hosting',
          rows: [
            ['Host', 'GitHub Pages (GitHub, Inc.)'],
            ['Address', '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA'],
            ['Delivery', 'Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA'],
          ],
        },
        {
          title: 'Intellectual property',
          text: 'All content on this site (text, graphics, code) belongs to Camille HACQUET unless stated otherwise. Any reproduction without prior permission is prohibited.',
        },
        {
          title: 'Personal data',
          text: 'This site sets no cookies and uses no audience measurement tool; the host and the delivery network may keep technical connection logs. If you contact me by email, your details are used solely to reply to you.',
        },
      ],
    },
  },
}

// Réponses de FAQ en attente de validation. Cet export n'est importé nulle
// part : il n'est donc ni affiché, ni présent dans les fichiers publiés.
// Pour publier une réponse : la relire, la déplacer dans `faq.items` de la
// langue correspondante et retirer `draft: true`.
export const faqDrafts = {
  fr: [
    {
      draft: true,
      q: 'Quelle différence entre un pentest et un programme de bug bounty ?',
      a: "Un test d'intrusion est une mission cadrée : un périmètre et un rapport définis à l'avance. Un programme de bug bounty reste ouvert dans le temps : des chercheurs indépendants signalent les failles qu'ils trouvent. Les deux approches se complètent.",
    },
    {
      draft: true,
      q: 'Que contient le rapport ?',
      a: 'Chaque vulnérabilité y est décrite avec les étapes pour la reproduire, son impact et des recommandations de correction.',
    },
    {
      draft: true,
      q: 'Que faut-il préparer avant un test ?',
      a: "Le périmètre à tester, un environnement et des comptes de test, ainsi qu'un interlocuteur technique joignable pendant la mission.",
    },
  ],
  en: [
    {
      draft: true,
      q: 'What is the difference between a pentest and a bug bounty programme?',
      a: 'A penetration test is a scoped engagement: the scope and the report are defined in advance. A bug bounty programme stays open over time: independent researchers report the flaws they find. The two approaches complement each other.',
    },
    {
      draft: true,
      q: 'What does the report contain?',
      a: 'Each vulnerability is described with the steps to reproduce it, its impact and recommendations for fixing it.',
    },
    {
      draft: true,
      q: 'What should be prepared before a test?',
      a: 'The scope to test, a test environment and test accounts, and a technical contact who can be reached during the engagement.',
    },
  ],
}
