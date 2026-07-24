import { Link } from 'react-router-dom'

const VARIANT_CLASS = {
  terracota: 'btn-terracota',
  'outline-crema': 'btn-outline-crema',
  'outline-verde': 'btn-outline-verde',
}

/**
 * Shared CTA button. Renders a react-router <Link> for internal routes,
 * a plain <a> for external/anchor hrefs (wa.me, instagram, #anchors).
 * `arrow` wraps the trailing glyph in a <span> so the existing
 * .btn-*:hover span { transform: translateX(4px) } rule can pick it up.
 */
export default function Button({
  variant = 'terracota',
  href,
  arrow,
  icon,
  children,
  className = '',
  onClick,
  style,
}) {
  const classes = `${VARIANT_CLASS[variant] || VARIANT_CLASS.terracota} ${className}`.trim()
  const content = (
    <>
      {icon}
      {children}
      {arrow ? <span>{arrow}</span> : null}
    </>
  )

  const isExternal = href && (href.startsWith('http') || href.startsWith('#'))

  if (!href) {
    return (
      <button type="button" className={classes} onClick={onClick} style={style}>
        {content}
      </button>
    )
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith('#') ? undefined : '_blank'}
        rel={href.startsWith('#') ? undefined : 'noopener'}
        className={classes}
        onClick={onClick}
        style={style}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={href} className={classes} onClick={onClick} style={style}>
      {content}
    </Link>
  )
}
