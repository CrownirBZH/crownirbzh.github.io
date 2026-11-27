// Lien externe : s'ouvre dans un nouvel onglet. La flèche est décorative.
// La destination précise (`hint`) et l'ouverture dans une nouvelle fenêtre
// sont annoncées aux lecteurs d'écran par aria-label, sans rien ajouter au
// texte de la page (modes lecture, moteurs de recherche).
export default function External({ href, className, arrow = true, icon, text, hint = '', newWindow }) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${text}${hint} ${newWindow}`}
    >
      {icon}
      {text}
      {arrow && <span aria-hidden="true"> ↗</span>}
    </a>
  )
}
