import { Link } from 'react-router-dom'

// Same public/ path the Navbar preloads — kept as one shared file rather
// than a duplicate hashed copy in src/assets.
const LOGO_URL = '/logo-surf-lobitos.webp'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div>
          <div className="brand">
            <img
              src={LOGO_URL}
              alt="Hotel Bruma Restaurant &amp; Surf Academy"
              width={288}
              height={88}
              loading="lazy"
            />
          </div>
          <p className="tagline">Un refugio de tranquilidad frente al mar en Lobitos, Perú.</p>
          <p>Lobitos, Perú</p>
          <p>
            <a href="https://wa.me/51904767959" target="_blank" rel="noopener" className="phone-link">+51 904 767 959</a>
          </p>
        </div>
        <div>
          <div className="col-title">Navegación</div>
          <div className="col-links">
            <Link to="/" className="foot-a">Inicio</Link>
            <Link to="/hotel-lobitos" className="foot-a">Hotel Bruma</Link>
            <Link to="/surf-academy" className="foot-a">Surf Academy</Link>
          </div>
        </div>
        <div>
          <div className="col-title">Síguenos</div>
          <div className="col-links">
            <a href="https://www.instagram.com/luism9_/" target="_blank" rel="noopener" className="foot-a">Instagram ↗</a>
            <a href="https://wa.me/51904767959" target="_blank" rel="noopener" className="foot-a">WhatsApp ↗</a>
          </div>
        </div>
      </div>

      <div className="footer-wordmark"><div>Bruma</div></div>

      <div className="footer-bottom">
        <p>© 2026 Hotel Bruma. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
