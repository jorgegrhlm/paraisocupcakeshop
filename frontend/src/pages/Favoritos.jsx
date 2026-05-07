import { Link } from 'react-router-dom'
import useFavoritos from '../hooks/useFavoritos'
import ProductoCard from '../components/ProductoCard/ProductoCard'
import './Favoritos.css'

function Favoritos() {
  const { favoritos, clearFavoritos } = useFavoritos()

  // Pide confirmación antes de borrar todos los favoritos.
  const handleLimpiar = () => {
    if (window.confirm('¿Seguro que quieres quitar todos los favoritos?')) {
      clearFavoritos()
    }
  }

  // ===== Estado vacío =====
  if (favoritos.length === 0) {
    return (
      <section className="favoritos-page favoritos-page--vacio">
        <h1 className="favoritos-page__titulo">Mis Favoritos</h1>
        <p className="favoritos-page__mensaje">
          Aún no tienes productos marcados como favoritos. Explora el catálogo
          y pulsa el corazón para guardar los que más te gusten.
        </p>
        <Link to="/" className="favoritos-page__cta">
          Explorar la tienda
        </Link>
      </section>
    )
  }

  // ===== Listado de favoritos =====
  return (
    <section className="favoritos-page">
      <header className="favoritos-page__header">
        <div>
          <h1 className="favoritos-page__titulo">Mis Favoritos</h1>
          <span className="favoritos-page__contador">
            {favoritos.length} producto{favoritos.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          type="button"
          className="favoritos-page__limpiar"
          onClick={handleLimpiar}
        >
          Limpiar todos
        </button>
      </header>

      <div className="favoritos-grid">
        {favoritos.map((fav) => {
          // El ProductoCard espera el campo "id", pero en el contexto
          // guardamos "productoId". Adaptamos el objeto al renderizar.
          const productoCompatible = {
            id: fav.productoId,
            slug: fav.slug,
            nombre: fav.nombre,
            precio: fav.precio,
            imagen: fav.imagen,
          }
          return (
            <ProductoCard
              key={fav.productoId}
              producto={productoCompatible}
              variant="categoria"
            />
          )
        })}
      </div>
    </section>
  )
}

export default Favoritos