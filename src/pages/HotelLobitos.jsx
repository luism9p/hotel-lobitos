import { useRef } from 'react'
import CommitmentBlock from '../components/sections/CommitmentBlock.jsx'
import TheatricalReveal from '../components/sections/TheatricalReveal.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import fotoBote from '../assets/images/shared/foto-bote.avif'
import desayunoPhoto from '../assets/images/hotel/desayuno.webp'
import relajacionPhoto from '../assets/images/hotel/relajacion.webp'
import recuperacionPhoto from '../assets/images/hotel/recuperacion.webp'
import conexionPhoto from '../assets/images/hotel/conexion.webp'

/**
 * The real /el-hotel page on the live site is short and specific: Nuestro
 * Compromiso + a run of TheatricalReveal blocks (Desayuno, Relajación,
 * Recuperación y Movilidad, Conexión Directa a las Olas) — everything else
 * that used to live here (Nuestra Historia, Servicios, Nuestra Casa, etc.)
 * belongs on Home/Inicio, matching the live site's actual structure.
 */
export default function HotelLobitos() {
  const pageRef = useRef(null)
  useScrollReveal(pageRef, [])

  return (
    <div ref={pageRef}>
      <CommitmentBlock
        isPageOpen
        eyebrow="Nuestro Compromiso"
        title={<>Hotel Lobitos,<br />viajar es <em>honrar</em><br />la naturaleza</>}
        text={
          <>
            Fusionamos calidez regional con iniciativas ecosostenibles que salvaguardan el ecosistema de
            Lobitos. Mediante la utilización de insumos reciclados y el apoyo a proveedores de la zona, cada
            vivencia manifiesta nuestra entrega total a la preservación de los{' '}
            <span className="highlight">océanos</span> y el cuidado profundo de nuestra herencia terrestre.
          </>
        }
        image={fotoBote}
        imageAlt="Costa y comunidad de Piura"
        imageWidth={601}
        imageHeight={579}
        caption="Km 0 en la costa de Piura"
      />

      <TheatricalReveal
        items={[
          {
            eyebrow: 'Cada mañana',
            title: 'Desayuno',
            text: 'Desayuno incluido con una selección artesanal de productos locales, fruta fresca y café de granos seleccionados.',
            image: desayunoPhoto,
            imageAlt: 'Habitación de Hotel Lobitos con acceso a la terraza',
            imageWidth: 2816,
            imageHeight: 1536,
          },
          {
            eyebrow: 'Frente al mar',
            title: 'Relajación',
            text: 'Descubra la tranquilidad absoluta en nuestra terraza privada frente al mar, ideal para disfrutar del sol y el viento.',
            image: relajacionPhoto,
            imageAlt: 'Terraza privada de Hotel Lobitos frente al mar',
            imageWidth: 2816,
            imageHeight: 1536,
          },
          {
            title: 'Recuperación y Movilidad',
            text: 'El mar exige desgaste físico. Por eso, contamos con un espacio dedicado a la recuperación. Un área equipada con mats ideal para estirar, hacer yoga o practicar movimientos de entrenamiento funcional y jiu-jitsu para mantener la flexibilidad. Pensado para cuidar tu cuerpo después de una sesión intensa.',
            image: recuperacionPhoto,
            imageAlt: 'Área de recuperación y movilidad de Hotel Lobitos con vista al mar',
            imageWidth: 2816,
            imageHeight: 1536,
          },
          {
            title: 'Conexión Directa a las Olas',
            text: 'Olvídate de la logística complicada. Despierta, disfruta de nuestro desayuno artesanal y baja directamente a recoger tu equipo. Tienes acceso inmediato a nuestras tablas e instructores sin salir de tu refugio.',
            image: conexionPhoto,
            imageAlt: 'Acceso directo desde la habitación a la playa con tablas de surf',
            imageWidth: 2816,
            imageHeight: 1536,
            ctaLabel: 'Descubrir Surf Academy',
            ctaHref: '/surf-academy',
          },
        ]}
      />
    </div>
  )
}
