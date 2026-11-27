import { Fragment, useEffect, useState } from 'react'

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Terminal décoratif : les lignes s'affichent l'une après l'autre.
// Pour les lecteurs d'écran, c'est une illustration décrite par `label`.
// L'état initial (0) est le même au prérendu et dans le navigateur ;
// tout ce qui dépend de `window` reste dans l'effet.
export default function Terminal({ label, lines }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= lines.length) return
    // Animations réduites : tout afficher d'un coup, sans attente.
    const reduced = prefersReducedMotion()
    const next = lines[count]
    const wait = reduced ? 0 : count === 0 ? 500 : next.kind === 'cmd' ? 900 : 380
    const timer = setTimeout(() => {
      setCount((c) => {
        if (reduced) return lines.length
        // Une commande écrite sur plusieurs lignes (suite marquée « cont »)
        // s'affiche d'un seul coup.
        let n = c + 1
        while (lines[n]?.kind === 'cont') n += 1
        return n
      })
    }, wait)
    return () => clearTimeout(timer)
  }, [count, lines])

  return (
    <figure className="terminal" role="img" aria-label={label}>
      <div className="terminal__bar" aria-hidden="true">
        <span className="terminal__dots">
          <span />
          <span />
          <span />
        </span>
      </div>
      <pre className="terminal__body" aria-hidden="true">
        {lines.map((line, i) => (
          <Fragment key={line.text}>
            {/* Pendant l'animation, le curseur attend au début de la prochaine
                ligne à afficher (hors flux, sans décaler son texte). */}
            {i === count && <span className="t-cursor t-cursor--waiting" />}
            <span className={`t-line t-${line.kind}${i < count ? ' is-on' : ''}`}>
              {line.kind === 'cmd' && <span className="t-prompt">$ </span>}
              {line.kind === 'cont' && '    '}
              {line.text}
              {line.note && <span className="t-note"> {line.note}</span>}
              {'\n'}
            </span>
          </Fragment>
        ))}
        {count >= lines.length && <span className="t-cursor" />}
      </pre>
    </figure>
  )
}
