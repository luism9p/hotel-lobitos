import { useRef } from 'react'
import Hero from '../components/sections/Hero.jsx'
import StickyHistoria from '../components/sections/StickyHistoria.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import HorizontalGallery from '../components/sections/HorizontalGallery.jsx'
import ServicesGrid from '../components/sections/ServicesGrid.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import f1 from '../assets/images/hero/f1.png'
import casa1 from '../assets/images/hotel/casa-01.jpg'
import casa2 from '../assets/images/hotel/casa-02.jpg'
import casa3 from '../assets/images/hotel/casa-03.jpg'
import surfPhoto from '../assets/images/surf/foto-buceando.avif'
import terrazaPhoto from '../assets/images/hotel/f2.avif'
import roomPhoto from '../assets/images/_incoming/room-spare-1.jpg'
import wifiPhoto from '../assets/images/hotel/foto-wifi.png'
import movilidadPhoto from '../assets/images/hotel/foto-movilidad.png'
import estacionamientoPhoto from '../assets/images/hotel/estacionamiento.png'
import refugioPhoto from '../assets/images/hotel/refugio-lobitos.png'

/**
 * Home — Página de inicio del Hotel Lobitos.
 *
 * Secciones avanzadas de animación:
 * - StickyHistoria: título gigante anclado (GSAP pin) / párrafos derechos fluyen
 * - HorizontalGallery: galería con scroll horizontal falso (GSAP pin + x-tween)
 */
export default function Home() {
  const pageRef = useRef(null)
  useScrollReveal(pageRef, [])

  return (
    <div ref={pageRef}>
      <Hero
        variant="centered"
        eyebrow="Lobitos · Piura · Perú"
        titleLines={['Hotel', 'Lobitos']}
        image={f1}
        imageAlt="Surfistas con tablas bajo la palapa, frente al mar en Lobitos"
        description="Un refugio frente al mar donde el surf, la buena mesa y el descanso conviven."
        cta={{ label: 'Descubre el hotel', href: '#historia', arrow: '→' }}
      />

      {/* ── Nuestra Historia — sticky split layout ───────────────────────── */}
      <StickyHistoria
        id="historia"
        eyebrow="Nuestra Historia"
        title="Experiencia frente al mar"
        tone="verde"
        paragraphs={[
          {
            animatedText: true,
            text: 'En Hotel Lobitos, la brisa del Pacífico es nuestra mejor bienvenida. Nos ubicamos en primera línea de playa, ofreciendo a nuestros huéspedes una conexión inigualable con el entorno natural de Lobitos.',
          },
          {
            eyebrow: 'Un poco de Lobitos',
            text: 'Lobitos es un destino legendario para el surf y la contemplación. Más que un hotel, somos guardianes de esta cultura costera, invitándole a explorar los rincones más auténticos de nuestra localidad y su energía única.',
          },
          {
            eyebrow: 'La mejor opción en Lobitos',
            text: 'Elegirnos significa optar por la excelencia en hospitalidad profesional con un toque familiar. Nos esforzamos por brindar un ambiente tranquilo donde el descanso y la aventura del surf convivan en perfecta armonía para crear recuerdos inolvidables.',
          },
        ]}
      />

      {/* No section-pad wrapper here on purpose — ServicesGrid renders its
          own <section> with its own vertical padding; wrapping it in
          another padded section would double it up. This div only sets
          the background/text color. */}
      <div style={{ background: 'var(--color-verde)', color: 'var(--color-crema)' }}>
        <ServicesGrid
          title="Servicios & Comodidades"
          sub="Todo lo que necesitas para una estancia perfecta frente al mar en Lobitos."
          onVerde
          items={[
            {
              title: 'Enfoque en Surf',
              text: 'Ubicación inmejorable frente a las mejores olas de Lobitos.',
              image: surfPhoto,
            },
            {
              title: 'Terraza privada',
              text: 'Vistas espectaculares y ambiente tranquilo para tu descanso total.',
              image: terrazaPhoto,
            },
            {
              title: 'Habitaciones confortables',
              text: 'Diseñadas para el relax con un enfoque en la comodidad y naturaleza.',
              image: roomPhoto,
            },
            {
              title: 'WiFi gratuito',
              text: 'Conexión estable para que compartas tus mejores olas o trabajes frente al mar.',
              image: wifiPhoto,
              imageAlt: 'Huésped trabajando en su laptop con vista al mar en Hotel Lobitos',
            },
            {
              title: 'Traslado Directo',
              text: 'Traslados al aeropuerto para su mayor comodidad y bienestar.',
              image: movilidadPhoto,
              imageAlt: 'Van de traslado de Hermanos del Norte en la entrada de Hotel Lobitos',
            },
            {
              title: 'Estacionamiento privado',
              text: 'Seguridad y comodidad para tu vehículo durante toda tu estancia.',
              image: estacionamientoPhoto,
              imageAlt: 'Vehículo con tablas de surf en el estacionamiento privado de Hotel Lobitos',
            },
          ]}
        />
      </div>

      <CTABanner
        variant="on-terracota"
        immersive
        image={refugioPhoto}
        imageAlt="Surfista dentro del tubo de una ola en Lobitos"
        title="Tu Refugio en el Mar de Lobitos"
        copy="Descanse y surfee en un ambiente tranquilo frente al paraíso. El hotel ideal frente al mar para su descanso."
        phone="+51 974 578 082"
        ctaLabel="Reservar Ahora"
        ctaHref="https://wa.me/51974578082"
      />

      {/* ── Nuestra Casa — horizontal scroll gallery ──────────────────────── */}
      <section style={{ background: 'var(--color-verde)' }}>
        <HorizontalGallery
          title="Nuestra Casa"
          sub="Descubre la magia de nuestras terrazas y el entorno natural. Un espacio diseñado para el descanso y la conexión con el mar."
          onVerde
          items={[
            { image: casa1, alt: 'Loft con balcón frente al mar en Hotel Lobitos', caption: 'Loft frente al mar' },
            { image: casa2, alt: 'Espacio común de Hotel Lobitos', caption: 'Espacios comunes' },
            { image: casa3, alt: 'Habitación con balcón frente al mar en Hotel Lobitos', caption: 'Habitaciones con vista' },
          ]}
        />
      </section>

      <CTABanner
        variant="on-verde"
        marquee
        title="Reserva tu Estancia"
        ctaLabel="Contactar"
        ctaHref="https://wa.me/51974578082"
      />
    </div>
  )
}
