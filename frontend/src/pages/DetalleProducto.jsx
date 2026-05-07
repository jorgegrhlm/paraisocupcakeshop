import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProducto from '../hooks/useProducto'
import useProductosPorCategoria from '../hooks/useProductosPorCategoria'
import useCart from '../hooks/useCart'
import useFavoritos from '../hooks/useFavoritos'
import CarruselFotos from '../components/CarruselFotos/CarruselFotos'
import ProductoCard from '../components/ProductoCard/ProductoCard'
import BotonCorazon from '../components/BotonCorazon/BotonCorazon'
import { getImageUrl } from '../utils/getImageUrl'
import './DetalleProducto.css'

const formatPrecio = (n) =>
  `€${parseFloat(n).toFixed(2).replace('.', ',')}`

function DetalleProducto() {
  const { slug } = useParams()
  const { producto, loading, error, notFound } = useProducto(slug)
  const { addItem, setQuantity, items } = useCart()
  const { esFavorito } = useFavoritos()

  const [añadido, setAñadido] = useState(false)

  // Productos relacionados (misma categoría)
  const categoriaSlug = producto?.categoria_slug
  const { productos: relacionados } = useProductosPorCategoria(
    categoriaSlug,
    { soloDisponibles: true }
  )

  // Productos relacionados aleatorios.
  // CRÍTICO: este useMemo va aquí arriba, ANTES de los if/return,
  // para que se llame siempre en el mismo orden (regla de hooks).
  // Manejamos producto null devolviendo [] para que no rompa.
  const otrosRelacionados = useMemo(() => {
    if (!producto) return []
    const filtrados = relacionados.filter((p) => p.id !== producto.id)
    const mezclados = [...filtrados]
    for (let i = mezclados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]]
    }
    return mezclados.slice(0, 4)
  }, [relacionados, producto?.id])

  // ===== Pantallas alternativas (DESPUÉS de todos los hooks) =====
  if (notFound) {
    return (
      <section className="detalle-404">
        <h1>Producto no encontrado</h1>
        <p>No tenemos un producto con la URL «{slug}».</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </section>
    )
  }

  if (loading || !producto) {
    return <div className="detalle-loading">Cargando producto…</div>
  }

  if (error) {
    return (
      <section className="detalle-error">
        <p>Error cargando el producto. Recarga la página.</p>
      </section>
    )
  }

  // ===== Preparación de datos =====

  // Carrusel: imagen principal + adicionales
  const imagenesCarrusel = []
  if (producto.imagen) {
    imagenesCarrusel.push({
      src: getImageUrl(producto.imagen),
      alt: producto.nombre,
    })
  }
  producto.imagenes.forEach((img) => {
    imagenesCarrusel.push({
      src: getImageUrl(img.imagen),
      alt: img.descripcion || producto.nombre,
    })
  })

  // Cantidad de este producto en el carrito (0 si no está)
  const itemEnCarrito = items.find((i) => i.productoId === producto.id)
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0

  // Precio total = precio unitario × cantidad en carrito
  const precioTotal = parseFloat(producto.precio) * cantidadEnCarrito

  // ===== Handlers =====

  // "+" añade 1 al carrito (igual que el botón pero sin animación)
  const incrementar = () => {
    if (itemEnCarrito) {
      setQuantity(producto.id, cantidadEnCarrito + 1)
    } else {
      addItem(producto, 1)
    }
  }

  // "-" quita 1 del carrito (si llega a 0, lo elimina del carrito)
  const decrementar = () => {
    if (cantidadEnCarrito > 0) {
      setQuantity(producto.id, cantidadEnCarrito - 1)
    }
  }

  // Botón "Añadir al carrito": siempre suma 1 + animación verde
  const handleAñadirCarrito = () => {
    addItem(producto, 1)
    setAñadido(true)
    setTimeout(() => setAñadido(false), 1500)
  }

  return (
    <article className="detalle-producto">
      <h1 className="detalle-producto__titulo">{producto.nombre}</h1>

      <div className="detalle-producto__principal">
        {/* Columna izquierda: carrusel */}
        <div className="detalle-producto__carrusel">
          <CarruselFotos imagenes={imagenesCarrusel} />
        </div>

        {/* Columna central: precio + descripción */}
        <div className="detalle-producto__info">
          <p className="detalle-producto__precio">
            {formatPrecio(producto.precio)}
          </p>
          {producto.descripcion ? (
            <p className="detalle-producto__descripcion">
              {producto.descripcion}
            </p>
          ) : (
            <p className="detalle-producto__descripcion detalle-producto__descripcion--vacia">
              Producto sin descripción.
            </p>
          )}
        </div>

        {/* Columna derecha: card cantidad + botón añadir */}
        <aside className="detalle-producto__acciones">
          <div className="detalle-producto__favorito-fila">
            <BotonCorazon
              producto={producto}
              className="boton-corazon--grande"
              size={28}
            />
            <span className="detalle-producto__favorito-texto">
              {esFavorito(producto.id) ? 'Favorito' : 'Guardar como favorito'}
            </span>
          </div>

          <div className="cantidad-bloque">
            <span className="cantidad-bloque__label">Cantidad</span>
            <div className="cantidad-bloque__selector">
              <button
                type="button"
                onClick={decrementar}
                aria-label="Reducir cantidad"
                disabled={cantidadEnCarrito <= 0}
              >
                −
              </button>
              <span className="cantidad-bloque__valor">{cantidadEnCarrito}</span>
              <button
                type="button"
                onClick={incrementar}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className={`btn-anadir ${añadido ? 'is-anadido' : ''}`}
            onClick={handleAñadirCarrito}
            disabled={!producto.disponible}
          >
            {añadido
              ? '✓ AÑADIDO'
              : producto.disponible
              ? 'AÑADIR AL CARRITO'
              : 'NO DISPONIBLE'}
          </button>

          <div className="precio-total">
            <span>Precio Total:</span>
            <span className="precio-total__valor">
              {formatPrecio(precioTotal)}
            </span>
          </div>
        </aside>
      </div>

      {/* Productos relacionados */}
      {otrosRelacionados.length > 0 && (
        <section className="detalle-producto__relacionados">
          <h2>Productos Relacionados</h2>
          <div className="relacionados-grid">
            {otrosRelacionados.map((p) => (
              <ProductoCard key={p.id} producto={p} variant="categoria" />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default DetalleProducto