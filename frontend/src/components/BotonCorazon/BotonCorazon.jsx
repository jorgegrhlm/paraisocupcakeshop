import useFavoritos from '../../hooks/useFavoritos'
import './BotonCorazon.css'

/**
 * Botón circular con icono de corazón para marcar/desmarcar favoritos.
 *
 * Props:
 *   producto: objeto producto completo (necesita id, slug, nombre, precio, imagen).
 *   size:     tamaño del icono en píxeles (24 por defecto).
 *   className: clases CSS extra opcionales (para posicionarlo absolute, etc.).
 */
function BotonCorazon({ producto, size = 24, className = '' }) {
  const { esFavorito, toggleFavorito } = useFavoritos()
  const activo = esFavorito(producto.id)

  const handleClick = (e) => {
    // Crítico: si el botón está dentro de un <Link> (como en ProductoCard),
    // sin esto el click navegaría al detalle del producto en lugar de
    // toggle el corazón.
    e.preventDefault()
    e.stopPropagation()
    toggleFavorito(producto)
  }

  return (
    <button
      type="button"
      className={`boton-corazon ${activo ? 'is-activo' : ''} ${className}`}
      onClick={handleClick}
      aria-label={activo ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={activo}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden="true"
        className="boton-corazon__icono"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  )
}

export default BotonCorazon