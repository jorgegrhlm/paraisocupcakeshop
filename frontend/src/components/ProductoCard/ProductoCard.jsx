import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/getImageUrl'
import './ProductoCard.css'

function ProductoCard({ producto, variant = 'home' }) {
  const imagenUrl = getImageUrl(producto.imagen)
  const className = `producto-card producto-card--${variant}`

  return (
    <Link to={`/productos/${producto.slug}`} className={className}>
      <div className="producto-card__imagen-wrapper">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={producto.nombre}
            className="producto-card__imagen"
            loading="lazy"
          />
        ) : (
          <div className="producto-card__placeholder">
            <span className="caption">Sin imagen</span>
          </div>
        )}
      </div>

      {variant === 'categoria' && (
        <div className="producto-card__info">
          <h3 className="producto-card__nombre">{producto.nombre}</h3>
        </div>
      )}
    </Link>
  )
}

export default ProductoCard