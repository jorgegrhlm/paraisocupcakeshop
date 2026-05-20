import { useEffect } from 'react'
import './Lightbox.css'

/**
 * Modal de imagen a tamaño completo.
 *
 * Props:
 *  - src: URL de la imagen
 *  - alt: texto alternativo
 *  - onClose: callback al cerrar (click en overlay, X o ESC)
 *
 * Para hacer zoom el usuario puede usar el zoom del navegador
 * (Ctrl + rueda en escritorio, pinch en táctil) — la imagen
 * mantiene su tamaño natural hasta el límite del viewport.
 */
function Lightbox({ src, alt = '', onClose }) {
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox__cerrar"
        onClick={onClose}
        aria-label="Cerrar imagen"
      >
        ×
      </button>
      <img
        src={src}
        alt={alt}
        className="lightbox__img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default Lightbox