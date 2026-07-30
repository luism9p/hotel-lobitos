import { useRef } from 'react'
import Hero from '../components/sections/Hero.jsx'
import StickyHistoria from '../components/sections/StickyHistoria.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import HorizontalGallery from '../components/sections/HorizontalGallery.jsx'
import ServicesGrid from '../components/sections/ServicesGrid.jsx'
import ServicesGallery from '../components/sections/ServicesGallery.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import heroPhoto from '../assets/images/hero/hotel-hero.webp'
import cuarto1 from '../assets/images/hotel/cuarto-1.webp'
import cuarto2 from '../assets/images/hotel/cuarto-2.webp'
import cuarto3 from '../assets/images/hotel/cuarto-3.webp'
import surfPhoto from '../assets/images/surf/enfoque-surf.webp'
import terrazaPhoto from '../assets/images/hotel/terraza-privada.webp'
import roomPhoto from '../assets/images/_incoming/room-spare-1.webp'
import wifiPhoto from '../assets/images/hotel/foto-wifi.webp'
import movilidadPhoto from '../assets/images/hotel/foto-movilidad.webp'
import estacionamientoPhoto from '../assets/images/hotel/estacionamiento.webp'
import refugioPhoto from '../assets/images/hotel/refugio-lobitos.webp'
import refugioPhotoMobile from '../assets/images/hotel/refugio-lobitos-mobile.webp'

// Shared by ServicesGrid (list + hover-follow photo) and ServicesGallery
// (hover-expand photo strip, right below it) — same 6 amenities, two
// visual treatments, one source of truth for the images/alt text.
const SERVICE_ITEMS = [
  {
    title: 'Enfoque en Surf',
    text: 'Ubicación inmejorable frente a las mejores olas de Lobitos.',
    image: surfPhoto,
    imageWidth: 900,
    imageHeight: 600,
  },
  {
    title: 'Terraza privada',
    text: 'Vistas espectaculares y ambiente tranquilo para tu descanso total.',
    image: terrazaPhoto,
    imageWidth: 900,
    imageHeight: 600,
  },
  {
    title: 'Habitaciones confortables',
    text: 'Diseñadas para el relax con un enfoque en la comodidad y naturaleza.',
    image: roomPhoto,
    imageWidth: 1440,
    imageHeight: 785,
  },
  {
    title: 'WiFi gratuito',
    text: 'Conexión estable para que compartas tus mejores olas o trabajes frente al mar.',
    image: wifiPhoto,
    imageAlt: 'Huésped trabajando en su laptop con vista al mar en Hotel Bruma',
    imageWidth: 1535,
    imageHeight: 1024,
  },
  {
    title: 'Traslado Directo',
    text: 'Traslados al aeropuerto para su mayor comodidad y bienestar.',
    image: movilidadPhoto,
    imageAlt: 'Van de traslado de Hermanos del Norte en la entrada de Hotel Bruma',
    imageWidth: 1536,
    imageHeight: 1024,
  },
  {
    title: 'Estacionamiento privado',
    text: 'Seguridad y comodidad para tu vehículo durante toda tu estancia.',
    image: estacionamientoPhoto,
    imageAlt: 'Vehículo con tablas de surf en el estacionamiento privado de Hotel Bruma',
    imageWidth: 1536,
    imageHeight: 1024,
  },
]

/**
 * Home — Página de inicio del Hotel Bruma.
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
        titleLines={['Hotel', 'Bruma']}
        image={heroPhoto}
        imageAlt="Vista aérea del hotel sobre el acantilado, con piscina infinita y un surfista en la ola frente a la costa de Lobitos"
        imageWidth={1680}
        imageHeight={938}
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
            text: 'En Hotel Bruma, la brisa del Pacífico es nuestra mejor bienvenida. Nos ubicamos en primera línea de playa, ofreciendo a nuestros huéspedes una conexión inigualable con el entorno natural de Lobitos.',
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
      <div className="services-section" style={{ background: 'var(--color-verde)', color: 'var(--color-crema)' }}>
        <ServicesGrid
          title="Servicios & Comodidades"
          sub="Todo lo que necesitas para una estancia perfecta frente al mar en Lobitos."
          onVerde
          items={SERVICE_ITEMS}
        />
        <ServicesGallery items={SERVICE_ITEMS} />
      </div>

      <CTABanner
        variant="on-terracota"
        immersive
        imagePriority
        image={refugioPhoto}
        mobileImage={refugioPhotoMobile}
        imageAlt="Surfista dentro del tubo de una ola en Lobitos"
        imageWidth={2752}
        imageHeight={1536}
        title="Tu Refugio en el Mar de Lobitos"
        copy="Descanse y surfee en un ambiente tranquilo frente al paraíso. El hotel ideal frente al mar para su descanso."
        phone="+51 904 767 959"
        ctaLabel="Reservar Ahora"
        ctaHref="https://wa.me/51904767959"
      />

      {/* ── Nuestra Casa — horizontal scroll gallery ──────────────────────── */}
      <section style={{ background: 'var(--color-verde)' }}>
        <HorizontalGallery
          title="Nuestra Casa"
          sub="Descubre la magia de nuestras terrazas y el entorno natural. Un espacio diseñado para el descanso y la conexión con el mar."
          onVerde
          items={[
            {
              image: cuarto1,
              alt: 'Habitación con cama con dosel y vista al mar en Hotel Bruma',
              caption: 'Loft frente al mar',
              imageWidth: 1440,
              imageHeight: 785,
            },
            {
              image: cuarto2,
              alt: 'Cabaña con hamaca y tabla de surf frente al mar en Hotel Bruma',
              caption: 'Espacios comunes',
              imageWidth: 1440,
              imageHeight: 804,
            },
            {
              image: cuarto3,
              alt: 'Habitación con balcón frente al mar en Hotel Bruma',
              caption: 'Habitaciones con vista',
              imageWidth: 1440,
              imageHeight: 785,
            },
          ]}
        />
      </section>

      <CTABanner
        variant="on-verde"
        marquee
        title="Reserva tu Estancia"
        ctaLabel="Contactar"
        ctaHref="https://wa.me/51904767959"
      />
    </div>
  )
}
