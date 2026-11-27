import { content, site } from '../content.js'

// Page 404 statique, dans les deux langues. Elle peut être servie depuis
// n'importe quelle adresse : `homeUrls` contient donc des liens absolus.
export default function NotFound({ homeUrls }) {
  return (
    <main id="main">
      <section className="section legal">
        <div className="container legal__inner">
          <a className="brand" href={homeUrls.fr} aria-label={site.name}>
            <span className="brand__first">{site.firstName}</span>{' '}
            <span className="brand__last">{site.lastName}</span>
            <span className="brand__cursor" aria-hidden="true" />
          </a>
          <h1>404</h1>
          {Object.keys(content).map((lang) => {
            const t = content[lang].notFound
            return (
              <div className="legal__block" key={lang} lang={lang}>
                <h2>{t.title}</h2>
                <p>{t.text}</p>
                <div className="actions">
                  <a className="link" href={homeUrls[lang]} hrefLang={lang}>
                    {t.home}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
