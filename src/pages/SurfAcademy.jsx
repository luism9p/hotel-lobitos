import { useRef } from 'react'
import Hero from '../components/sections/Hero.jsx'
import SectionTitle from '../components/ui/SectionTitle.jsx'
import BoardAccordion from '../components/sections/BoardAccordion.jsx'
import SurfTripsEditorial from '../components/sections/SurfTripsEditorial.jsx'
import BookingWidget from '../components/sections/BookingWidget.jsx'
import RequisitosBlock from '../components/sections/RequisitosBlock.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import dominaLasOlasPhoto from '../assets/images/surf/domina-las-olas.webp'
import toursYatePhoto from '../assets/images/shared/tours-yate.webp'
import exploracionMarinaPhoto from '../assets/images/surf/exploracion-marina.webp'
import softTopPhoto from '../assets/images/surf/soft-top.webp'
import funboardPhoto from '../assets/images/surf/funboard.webp'
import shortboardPhoto from '../assets/images/surf/shortboard.webp'
import exploracionPhoto from '../assets/images/surf/exploracion.webp'

const WA_HREF = 'https://wa.me/51904767959'

export default function SurfAcademy() {
  const pageRef = useRef(null)
  useScrollReveal(pageRef, [])

  return (
    <div ref={pageRef}>
      <Hero
        variant="page"
        eyebrow="Escuela de Surf Profesional"
        title="Domina las Olas de Lobitos con Expertos"
        image={dominaLasOlasPhoto}
        imageAlt="Instructor guiando a una alumna sobre la tabla en una ola de Lobitos"
        imageWidth={900}
        imageHeight={651}
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
                imageWidth: 2816,
                imageHeight: 1536,
                tag: 'Principiante',
                title: 'Soft-Top',
                text: 'Tablas estables y seguras, perfectas para tus primeras olas en las espumas de Lobitos.',
                ctaLabel: 'Alquilar Ahora',
                ctaHref: WA_HREF,
              },
              {
                image: funboardPhoto,
                imageAlt: 'Tabla Funboard apoyada en la caseta de Lobitos Surf Academy',
                imageWidth: 2816,
                imageHeight: 1536,
                tag: 'Intermedio',
                title: 'Funboard',
                text: 'Ideal para mejorar tu técnica y empezar a correr la pared de la ola con mayor control.',
                ctaLabel: 'Alquilar Ahora',
                ctaHref: WA_HREF,
              },
              {
                image: shortboardPhoto,
                imageAlt: 'Tabla Shortboard de alto rendimiento frente a una ola al atardecer',
                imageWidth: 2816,
                imageHeight: 1536,
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
            image: exploracionMarinaPhoto,
            imageAlt: 'Buzo con aletas descendiendo hacia una tortuga marina y un arrecife de coral en Lobitos',
            imageWidth: 1400,
            imageHeight: 764,
          },
          {
            title: 'Rutas costeras',
            text: 'Rutas guiadas hacia destinos emblemáticos del litoral norte y norte-centro del Perú como Pacasmayo, Poemape, Chicama, Negritos (sus múltiples playas), Lobitos (sus seis playas), Órganos, El Ñuro, Cabo Blanco, Punta Sal y Máncora, entre otros escenarios naturales de alto valor paisajístico.',
            image: toursYatePhoto,
            imageAlt: 'Yate navegando frente a los acantilados de la costa de Lobitos al atardecer',
            imageWidth: 1400,
            imageHeight: 764,
          },
          {
            title: 'Exploración terrestre',
            text: 'Caminatas por zonas costeras, ingreso a cuevas, descubrimiento de playas ocultas y recorridos por caseríos locales, donde es posible observar la fauna regional y su entorno natural. Se integran también actividades de pesca recreativa.',
            image: exploracionPhoto,
            imageAlt: 'Caminante explorando cuevas costeras y caletas de pescadores en Lobitos',
            imageWidth: 2752,
            imageHeight: 1536,
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
        phone="+51 904 767 959"
        ctaLabel="Reservar Ahora"
        ctaHref={WA_HREF}
      />
    </div>
  )
}
