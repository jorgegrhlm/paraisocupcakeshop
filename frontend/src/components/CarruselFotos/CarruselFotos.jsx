import { useState } from 'react'
import Icon from '../Header/Icon'
import Lightbox from '../Lightbox/Lightbox'
import './CarruselFotos.css'

/**
 * Carrusel de imágenes para la pantalla de Detalle de Producto.
 *
 * Props:
 *   imagenes: array de { src, alt } ya con las URLs resueltas.
 *
 * Si solo hay 1 imagen → no muestra flechas ni dots.
 * Si el array está vacío → placeholder "Sin imagen disponible".
 */
function CarruselFotos({ imagenes = [] }) {
  const [indice, setIndice] = useState(0)
  const [lightboxAbierto, setLightboxAbierto] = useState(false)

  if (imagenes.length === 0) {
    return (
      <div className="carrusel-fotos carrusel-fotos--vacio">
        <span>Sin imagen disponible</span>
      </div>
    )
  }

  const total = imagenes.length
  // Avanzar/retroceder con wrap-around (después del último → primero)
  const irA = (i) => setIndice(((i % total) + total) % total)
  const anterior = () => irA(indice - 1)
  const siguiente = () => irA(indice + 1)

  const actual = imagenes[indice]

  return (
    <div className="carrusel-fotos">
      <div className="carrusel-fotos__slide">
        <button
          type="button"
          className="carrusel-fotos__btn-img"
          onClick={() => setLightboxAbierto(true)}
          aria-label="Ampliar imagen"
        >
          <img
            src={actual.src}
            alt={actual.alt || ''}
            className="carrusel-fotos__img"
          />
        </button>
        {total > 1 && (
          <>
            <button
              type="button"
              className="carrusel-fotos__flecha carrusel-fotos__flecha--prev"
              onClick={anterior}
              aria-label="Imagen anterior"
            >
              <Icon name="arrow-left" />
            </button>
            <button
              type="button"
              className="carrusel-fotos__flecha carrusel-fotos__flecha--next"
              onClick={siguiente}
              aria-label="Imagen siguiente"
            >
              <Icon name="arrow-right" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="carrusel-fotos__dots" role="tablist">
          {imagenes.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === indice}
              aria-label={`Ir a la imagen ${i + 1}`}
              className={`carrusel-fotos__dot ${i === indice ? 'is-active' : ''}`}
              onClick={() => irA(i)}
            />
          ))}
        </div>
      )}
      {lightboxAbierto && (
        <Lightbox
          src={actual.src}
          alt={actual.alt || ''}
          onClose={() => setLightboxAbierto(false)}
        />
      )}
    </div>
  )
}

export default CarruselFotos