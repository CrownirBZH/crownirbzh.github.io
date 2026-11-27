import External from './External.jsx'

export default function Legal({ t, homeHref }) {
  const { legal } = t
  return (
    <section className="section legal">
      <div className="container legal__inner">
        <a className="link" href={homeHref}>
          {t.nav.home}
        </a>
        <h1>{legal.title}</h1>
        {legal.sections.map((section) => (
          <div className="legal__block" key={section.title}>
            <h2>{section.title}</h2>
            {section.text && <p>{section.text}</p>}
            {section.rows && (
              <dl>
                {/* Une ligne peut porter un lien externe (3e valeur) et sa
                    précision pour les lecteurs d'écran (4e valeur). */}
                {section.rows.map(([label, value, link, hint]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {link ? (
                        <External
                          className="link"
                          href={link}
                          text={value}
                          hint={hint}
                          newWindow={t.nav.newWindow}
                        />
                      ) : (
                        (value ?? <span className="todo">{legal.todo}</span>)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
