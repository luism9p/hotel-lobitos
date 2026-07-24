import { useRef } from 'react'
import Hero from '../components/sections/Hero.jsx'
import SectionTitle from '../components/ui/SectionTitle.jsx'
import BoardAccordion from '../components/sections/BoardAccordion.jsx'
import SurfTripsEditorial from '../components/sections/SurfTripsEditorial.jsx'
import BookingWidget from '../components/sections/BookingWidget.jsx'
import RequisitosBlock from '../components/sections/RequisitosBlock.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import f2 from '../assets/images/hotel/f2.avif'
import fotoBote from '../assets/images/shared/foto-bote.avif'
import fotoBuceando from '../assets/images/surf/foto-buceando.avif'
import softTopPhoto from '../assets/images/surf/soft-top.png'
import funboardPhoto from '../assets/images/surf/funboard.png'
import shortboardPhoto from '../assets/images/surf/shortboard.png'
import exploracionPhoto from '../assets/images/surf/exploracion.png'

const WA_HREF = 'https://wa.me/51974578082'

export default function SurfAcademy() {
  const pageRef = useRef(null)
  useScrollReveal(pageRef, [])

  return (
    <div ref={pageRef}>
      <Hero
        variant="page"
        eyebrow="Escuela de Surf Profesional"
        title="Domina las Olas de Lobitos con Expertos"
        image={f2}
        imageAlt="Surfista dentro de una ola en Lobitos"
        description="En Surf Academy Lobitos, transformamos tu pasión en técnica. Ya seas principiante o busques perfeccionar tu estilo, nuestros instructores locales te guiarán en las mejores izquierdas del mundo con un enfoque personalizado y aventurero."
        cta={{ label: 'Ver Clases', href: '#tablas', arrow: '→' }}
      />

      <section id="tablas" className="section-pad" style={{ background: 'var(--color-crema)' }}>
        <div className="container" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: 1440 }}>
          <SectionTitle
            title="Alquiler de Tablas y Equipo"
            sub="Contamos con una amplia variedad de tablas para todos los niveles, desde principiantes hasta surfistas avanzados."
          />
          <BoardAccordion
            items={[
              {
                image: softTopPhoto,
                imageAlt: 'Tabla Soft-Top con huella de mano en la arena, frente al mar en Lobitos',
                tag: 'Principiante',
                title: 'Soft-Top',
                text: 'Tablas estables y seguras, perfectas para tus primeras olas en las espumas de Lobitos.',
                ctaLabel: 'Alquilar Ahora',
                ctaHref: WA_HREF,
              },
              {
                image: funboardPhoto,
                imageAlt: 'Tabla Funboard apoyada en la caseta de Lobitos Surf Academy',
                tag: 'Intermedio',
                title: 'Funboard',
                text: 'Ideal para mejorar tu técnica y empezar a correr la pared de la ola con mayor control.',
                ctaLabel: 'Alquilar Ahora',
                ctaHref: WA_HREF,
              },
              {
                image: shortboardPhoto,
                imageAlt: 'Tabla Shortboard de alto rendimiento frente a una ola al atardecer',
                tag: 'Avanzado',
                title: 'Shortboard',
                text: 'Tablas de alto rendimiento para quienes buscan velocidad y maniobras radicales.',
                ctaLabel: 'Alquilar Ahora',
                ctaHref: WA_HREF,
              },
            ]}
          />
        </div>
      </section>

      {/* No section-pad/container wrapper here on purpose — SurfTripsEditorial
          renders its own full-bleed <section> (background + pin target),
          same reasoning as ServicesGrid/StickyHistoria elsewhere. */}
      <SurfTripsEditorial
        title="Surf Trips & Yacht Tours"
        intro="Descubra el litoral de Lobitos con travesías creadas y guiadas por locales que conocen cada rincón del mar y la costa."
        categories={[
          {
            title: 'Exploración marina',
            text: 'Experiencias de exploración marina y costera que incluyen apnea, buceo en arrecifes y actividades de inmersión con protocolos de seguridad completos. Se integran también zonas de inmersión tipo "casa submarina", orientadas a la conexión directa con el ecosistema marino.',
            image: fotoBuceando,
            imageAlt: 'Buzo explorando el arrecife en Lobitos',
          },
          {
            title: 'Rutas costeras',
            text: 'Rutas guiadas hacia destinos emblemáticos del litoral norte y norte-centro del Perú como Pacasmayo, Poemape, Chicama, Negritos (sus múltiples playas), Lobitos (sus seis playas), Órganos, El Ñuro, Cabo Blanco, Punta Sal y Máncora, entre otros escenarios naturales de alto valor paisajístico.',
            image: fotoBote,
            imageAlt: 'Yacht tour en la costa de Lobitos',
          },
          {
            title: 'Exploración terrestre',
            text: 'Caminatas por zonas costeras, ingreso a cuevas, descubrimiento de playas ocultas y recorridos por caseríos locales, donde es posible observar la fauna regional y su entorno natural. Se integran también actividades de pesca recreativa.',
            image: exploracionPhoto,
            imageAlt: 'Caminante explorando cuevas costeras y caletas de pescadores en Lobitos',
          },
        ]}
        ctaLabel="Reservar Tour"
        ctaHref={WA_HREF}
      />

      <section className="section-pad booking-section" style={{ background: 'var(--color-verde)', color: 'var(--color-crema)' }}>
        <div className="container" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: 1440 }}>
          <BookingWidget eyebrow="Reserva Rápida" />
        </div>
      </section>

      <RequisitosBlock
        tag="Requisitos"
        text="Para nuestras sesiones y alquileres, pedimos buena actitud y respeto por el mar. Es obligatorio saber nadar para las clases de iniciación. Todo el equipo está incluido."
      />

      <CTABanner
        variant="on-terracota"
        title="WhatsApp reservas"
        phone="+51 974 578 082"
        ctaLabel="Reservar Ahora"
        ctaHref={WA_HREF}
      />
    </div>
  )
}
