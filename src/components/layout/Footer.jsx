import { Link } from 'react-router-dom'
import logoMark from '../../assets/icons/logo-surf-lobitos.webp'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div>
          <div className="brand">
            <img
              src={logoMark}
              alt="Hotel Lobitos Restaurant &amp; Surf Academy"
              width={1300}
              height={398}
              loading="lazy"
            />
          </div>
          <p className="tagline">Un refugio de tranquilidad frente al mar en Lobitos, Perú.</p>
          <p>Lobitos, Perú</p>
          <p>
            <a href="https://wa.me/51974578082" target="_blank" rel="noopener" className="phone-link">+51 974 578 082</a>
          </p>
        </div>
        <div>
          <div className="col-title">Navegación</div>
          <div className="col-links">
            <Link to="/" className="foot-a">Inicio</Link>
            <Link to="/hotel-lobitos" className="foot-a">Hotel Lobitos</Link>
            <Link to="/surf-academy" className="foot-a">Surf Academy</Link>
          </div>
        </div>
        <div>
          <div className="col-title">Síguenos</div>
          <div className="col-links">
            <a href="https://instagram.com/surf_academy_lobitos" target="_blank" rel="noopener" className="foot-a">Instagram ↗</a>
            <a href="https://wa.me/51974578082" target="_blank" rel="noopener" className="foot-a">WhatsApp ↗</a>
          </div>
        </div>
      </div>

      <div className="footer-wordmark"><div>Lobitos</div></div>

      <div className="footer-bottom">
        <p>© 2026 Hotel Lobitos. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
