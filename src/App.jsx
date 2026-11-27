import { useEffect, useState } from 'react'
import External from './components/External.jsx'
import { ArrowIcon, LinkedInIcon, MailIcon } from './components/Icons.jsx'
import Legal from './components/Legal.jsx'
import Reveal from './components/Reveal.jsx'
import Terminal from './components/Terminal.jsx'
import { content, site } from './content.js'
import { href, routeFor, sectionFromPath, sectionHref } from './routes.js'

// Convention des liens : « → » après un lien qui ouvre un email, « ↗ » après
// un lien externe. Les deux signes sont décoratifs (masqués aux lecteurs
// d'écran).

// Année figée à la compilation (voir vite.config.js) : le HTML prérendu et le
// navigateur affichent ainsi exactement la même valeur.
const YEAR = __BUILD_YEAR__

const NAV_SECTIONS = ['pentest', 'reverse', 'dev', 'about']

// Chaque page (accueil, mentions légales) existe dans chaque langue sous sa
// propre URL : `route` vient de src/routes.js et décide de tout l'affichage.
export default function App({ route }) {
  const lang = route.lang
  const isLegal = route.page === 'legal'
  const t = content[lang]
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(t.contact.subject)}&body=${encodeURIComponent(t.contact.body.join('\r\n'))}`
  const homeHref = href(route, routeFor(lang, 'home'))
  // Liens vers les sections de l'accueil : de vraies adresses, sans « # ».
  const links = { home: homeHref }
  for (const id of [...NAV_SECTIONS, 'contact']) links[id] = sectionHref(route, id)

  // Signale à index.html que l'application a bien démarré (sinon la classe
  // « js » est retirée et plus rien ne reste masqué).
  useEffect(() => {
    window.__appReady = true
  }, [])

  // Sur l'accueil : à l'ouverture d'une adresse de section (/pentest) et
  // quand le visiteur utilise Précédent / Suivant, aller à la bonne section.
  useEffect(() => {
    if (isLegal) return
    const sync = () => {
      // Une ancre (#main, lien d'évitement) est gérée par le navigateur.
      if (window.location.hash) return
      scrollToSection(sectionFromPath(window.location.pathname, lang), 'instant')
    }
    if (sectionFromPath(window.location.pathname, lang)) sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [isLegal, lang])

  // Clic sur un lien de section depuis l'accueil : on défile sans recharger
  // la page et l'adresse devient celle du lien. Depuis une autre page, le
  // lien se comporte normalement.
  const onNavigate = (event, id) => {
    if (isLegal || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    const url = event.currentTarget.href
    if (url !== window.location.href) window.history.pushState(null, '', url)
    scrollToSection(id)
  }

  return (
    <>
      <a className="skip" href="#main">
        {t.nav.skip}
      </a>
      <Header t={t} route={route} links={links} onNavigate={onNavigate} />
      <main id="main" tabIndex={-1}>
        {isLegal ? (
          <Legal t={t} homeHref={homeHref} />
        ) : (
          <Home t={t} mailto={mailto} links={links} onNavigate={onNavigate} />
        )}
      </main>
      <Footer t={t} route={route} links={links} onNavigate={onNavigate} />
    </>
  )
}

// `id` nul : haut de page. Sans `behavior`, le défilement suit le réglage CSS
// (doux, ou immédiat si le visiteur a demandé moins d'animations).
// Le focus suit le défilement : au clavier, la tabulation reprend dans la
// section atteinte, et un lecteur d'écran annonce son titre.
function scrollToSection(id, behavior) {
  const options = behavior ? { behavior } : {}
  const target = document.getElementById(id ?? 'top')
  if (!id) window.scrollTo({ top: 0, ...options })
  else target?.scrollIntoView(options)
  target?.focus({ preventScroll: true })
}

function Brand({ t, links, onNavigate }) {
  return (
    <a
      className="brand"
      href={links.home}
      aria-label={t.nav.homeLabel}
      onClick={(event) => onNavigate(event, null)}
    >
      <span className="brand__first">{site.firstName}</span>{' '}
      <span className="brand__last">{site.lastName}</span>
      <span className="brand__cursor" aria-hidden="true" />
    </a>
  )
}

function Header({ t, route, links, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header__inner">
        <Brand t={t} links={links} onNavigate={onNavigate} />
        <nav className="nav" aria-label={t.nav.label}>
          <ul>
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a href={links[id]} onClick={(event) => onNavigate(event, id)}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__actions">
          <nav className="lang" aria-label={t.nav.langLabel}>
            <ul>
              {Object.keys(content).map((code) => {
                const active = route.lang === code
                return (
                  <li key={code}>
                    <a
                      href={href(route, routeFor(code, route.page))}
                      hrefLang={code}
                      lang={code}
                      className={active ? 'is-active' : undefined}
                      aria-label={`${code.toUpperCase()} ${site.languages[code]}`}
                      aria-current={active ? 'true' : undefined}
                    >
                      {code.toUpperCase()}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <a
            className="btn btn--primary btn--sm"
            href={links.contact}
            onClick={(event) => onNavigate(event, 'contact')}
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  )
}

function Home({ t, mailto, links, onNavigate }) {
  const faqItems = t.faq.items.filter((item) => !item.draft)

  return (
    <>
      <section className="hero" id="top" tabIndex={-1}>
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1>
              <span className="eyebrow">{t.hero.eyebrow}</span>
              <span className="sr-only">{t.nav.sep}</span>
              <br className="reader-break" />
              {t.hero.title[0]} <span className="accent">{t.hero.title[1]}</span>
            </h1>
            <p className="lead">{t.hero.lead}</p>
            <ul className="actions">
              <li>
                <a className="btn btn--primary" href={mailto}>
                  {t.hero.primary}
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <External
                  className="btn btn--ghost"
                  href={site.linkedin}
                  newWindow={t.nav.newWindow}
                  icon={<LinkedInIcon />}
                  text={t.hero.secondary}
                />
              </li>
            </ul>
          </div>
          <Terminal label={t.hero.terminalAlt} lines={t.hero.terminal} />
        </div>

        <div className="container hero__facts">
          <ul className="facts">
            {t.facts.map((fact) => (
              <li key={fact.value}>
                <strong className="facts__value">{fact.value}</strong>
                <br className="reader-break" />
                <span className="facts__label">
                  {fact.label}
                  {fact.link && (
                    <>
                      {' '}
                      <External
                        className="link"
                        href={site.hallOfFame}
                        text={fact.linkLabel}
                        newWindow={t.nav.newWindow}
                      />
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="pentest" tabIndex={-1}>
        <div className="container">
          <SectionHead t={t} {...t.pentest} />
          <div className="cards">
            {t.pentest.cards.map((card, i) => (
              <Reveal as="article" className="card" key={card.title} delay={i * 80}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="actions section-cta">
            <a className="link" href={mailto}>
              {t.pentest.cta}
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="reverse" tabIndex={-1}>
        <div className="container split">
          <SectionHead t={t} {...t.reverse} />
          <ol className="stack-list">
            {t.reverse.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 80}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="dev" tabIndex={-1}>
        {/* Le titre précède le panneau dans le HTML ; sur grand écran, le CSS
            (.split--reverse) l'affiche à droite. */}
        <div className="container split split--reverse">
          <SectionHead t={t} {...t.dev} />
          <Reveal className="panel">
            <ul className="panel__list">
              {t.dev.items.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
            <ul className="tags tags--bright">
              {t.dev.stack.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" id="why" tabIndex={-1}>
        <div className="container">
          <Reveal as="h2" className="center">
            {t.why.title}
          </Reveal>
          <div className="cards cards--2">
            {t.why.cards.map((card, i) => (
              <Reveal as="article" className="card card--plain" key={card.title} delay={(i % 2) * 80}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="actions actions--center section-cta">
            <a
              className="btn btn--primary"
              href={links.contact}
              onClick={(event) => onNavigate(event, 'contact')}
            >
              {t.why.cta}
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="about" tabIndex={-1}>
        <div className="container about">
          <Reveal className="about__badge" aria-hidden="true">
            CH
          </Reveal>
          <Reveal>
            <h2>
              <span className="eyebrow">{t.about.eyebrow}</span>
              <span className="sr-only">{t.nav.sep}</span>
              <br className="reader-break" />
              {t.about.title}
            </h2>
            {[t.about.intro, ...t.about.paragraphs].map((p) => (
              <p className="about__text" key={p}>
                {p}
              </p>
            ))}
            <div className="actions">
              <External
                className="link"
                href={site.linkedin}
                newWindow={t.nav.newWindow}
                text={t.about.linkedin}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {faqItems.length > 0 && (
        <section className="section section--alt" id="faq" tabIndex={-1}>
          <div className="container">
            <SectionHead t={t} {...t.faq} />
            <div className="faq">
              {faqItems.map((item, i) => (
                <Reveal as="article" className="card card--plain" key={item.q} delay={(i % 2) * 80}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="contact" tabIndex={-1}>
        <div className="container">
          <Reveal className="cta">
            <h2>
              <span className="eyebrow">{t.contact.eyebrow}</span>
              <span className="sr-only">{t.nav.sep}</span>
              <br className="reader-break" />
              {t.contact.title}
            </h2>
            <p className="lead">{t.contact.lead}</p>
            <ul className="actions actions--center">
              <li>
                <a className="btn btn--primary" href={mailto}>
                  <MailIcon />
                  {t.contact.email}
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <External
                  className="btn btn--ghost"
                  href={site.linkedin}
                  newWindow={t.nav.newWindow}
                  icon={<LinkedInIcon />}
                  text={t.contact.linkedin}
                />
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}

// Le sur-titre fait partie du <h2> : le titre de section contient ainsi les
// mots qui décrivent la prestation, sans changer l'apparence. Le séparateur
// masqué à l'écran sépare les deux phrases pour les lecteurs d'écran, les
// modes lecture et les robots qui ne lisent que le texte.
function SectionHead({ t, eyebrow, title, lead }) {
  return (
    <Reveal className="section-head">
      <h2>
        <span className="eyebrow">{eyebrow}</span>
        <span className="sr-only">{t.nav.sep}</span>
        <br className="reader-break" />
        {title}
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  )
}

function Footer({ t, route, links, onNavigate }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Brand t={t} links={links} onNavigate={onNavigate} />
          <p>{t.footer.tagline}</p>
        </div>
        <nav className="footer__nav" aria-label={t.footer.sections}>
          <ul>
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a href={links[id]} onClick={(event) => onNavigate(event, id)}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="footer__links">
          <li>
            <a href={`mailto:${site.email}`}>
              {site.email}
              <span aria-hidden="true"> →</span>
            </a>
          </li>
          <li>
            <External href={site.linkedin} newWindow={t.nav.newWindow} text="LinkedIn" />
          </li>
          <li>
            <a href={href(route, routeFor(route.lang, 'legal'))}>{t.footer.legal}</a>
          </li>
        </ul>
      </div>
      <div className="container footer__bottom">
        © {YEAR} {site.name}. {t.footer.rights}
      </div>
    </footer>
  )
}
