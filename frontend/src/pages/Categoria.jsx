import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCategoria from '../hooks/useCategoria'
import useProductosPorCategoria from '../hooks/useProductosPorCategoria'
import ProductoCard from '../components/ProductoCard/ProductoCard'
import { getImageUrl } from '../utils/getImageUrl'
import { MOSTRAR_PRECIOS } from '../config/tienda'
import './Categoria.css'
const ORDENES = [
  { value: '-creado', label: 'Más recientes' },
  { value: 'precio', label: 'Precio: menor a mayor' },
  { value: '-precio', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A-Z' },
  // En modo catalogo se descartan las dos opciones de precio: no tiene
  // sentido ordenar por un dato que el cliente no ve. Se filtran en vez
  // de borrarlas para que vuelvan solas al reactivar el interruptor.
].filter((orden) => MOSTRAR_PRECIOS || !orden.value.includes('precio'))

function Categoria() {
  const { slug } = useParams()

  // Filtros (estado local)
  const [ordering, setOrdering] = useState('-creado')
  const [soloDisponibles, setSoloDisponibles] = useState(true)
  const [soloDestacados, setSoloDestacados] = useState(false)

  // Datos
  const { categoria, loading: loadingCat, notFound } = useCategoria(slug)
  const { productos, loading: loadingProd, error } = useProductosPorCategoria(slug, {
    ordering,
    soloDisponibles,
    soloDestacados,
  })

  // 404 — la categoría no existe
  if (notFound) {
    return (
      <section className="categoria-404">
        <h1>Categoría no encontrada</h1>
        <p>No tenemos una categoría llamada «{slug}».</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </section>
    )
  }

  // Loading inicial de la categoría
  if (loadingCat) {
    return <div className="categoria-loading">Cargando categoría…</div>
  }

  return (
    <section className="categoria-page">

      {/* Cabecera de la categoría */}
      <header
        className="categoria-hero"
        style={
          categoria?.imagen
            ? { backgroundImage: `url(${getImageUrl(categoria.imagen)})` }
            : undefined
        }
      >
        <div className="categoria-hero__overlay">
          <h1 className="categoria-hero__titulo">{categoria?.nombre}</h1>
          {categoria?.descripcion && (
            <p className="categoria-hero__descripcion">{categoria.descripcion}</p>
          )}
        </div>
      </header>

      {/* Barra de filtros */}
      <div className="categoria-filtros">
        <div className="filtro-grupo">
          <label htmlFor="orden">Ordenar por:</label>
          <select
            id="orden"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
          >
            {ORDENES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <label className="filtro-checkbox">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
          />
          Solo disponibles
        </label>

        <label className="filtro-checkbox">
          <input
            type="checkbox"
            checked={soloDestacados}
            onChange={(e) => setSoloDestacados(e.target.checked)}
          />
          Solo destacados
        </label>

        <span className="filtro-contador">
          {!loadingProd && `${productos.length} producto${productos.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Grid de productos */}
      <div className="categoria-contenido">
        {loadingProd && (
          <p className="estado-mensaje">Cargando productos…</p>
        )}

        {error && (
          <p className="estado-mensaje estado-error">
            Hubo un problema al cargar los productos. Intenta recargar.
          </p>
        )}

        {!loadingProd && !error && productos.length === 0 && (
          <p className="estado-mensaje">
            No hay productos que coincidan con estos filtros.
          </p>
        )}

        {!loadingProd && !error && productos.length > 0 && (
          <div className="productos-grid">
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                variant="categoria"
              />
            ))}
          </div>
        )}
      </div>

    </section>
  )
}

export default Categoria