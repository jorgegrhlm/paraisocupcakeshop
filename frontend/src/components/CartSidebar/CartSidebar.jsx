import { useEffect } from 'react'
import useCart from '../../hooks/useCart'
import './CartSidebar.css'

// Parche: el backend devuelve URLs absolutas con el hostname interno de
// Docker ("http://backend:8000"), que el navegador no resuelve. Las
// normalizamos a localhost:8000, donde el backend está expuesto al host.
// TODO (Futuras mejoras 8.2): que Django genere las URLs con el dominio
// público (USE_X_FORWARDED_HOST + nginx en producción).
const normalizarUrlMedia = (url) => {
  if (!url) return ''
  return url.replace('http://backend:8000', 'http://localhost:8000')
}

function CartSidebar() {
  const {
    items,
    isCartOpen,
    closeCart,
    setQuantity,
    removeItem,
    total,
  } = useCart()

  // Cerrar con tecla ESC mientras el sidebar esté abierto.
  useEffect(() => {
    if (!isCartOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isCartOpen, closeCart])

  // Bloquear el scroll del body cuando el sidebar está abierto,
  // para que la pantalla de fondo no se desplace.
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  // Formato de moneda según locale español.
  const formatPrecio = (n) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(n)

  // Placeholders para los botones del footer: las pantallas
  // "Ver carrito" y "Checkout" llegarán en el Sprint V.
  const handleVerCarrito = () => {
    alert('Pantalla "Ver carrito" disponible en el Sprint V.')
  }

  const handleFinalizarCompra = () => {
    alert('Pantalla "Finalizar compra" disponible en el Sprint V.')
  }

  return (
    <>
      <div
        className={`cart-sidebar__overlay ${isCartOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden={!isCartOpen}
      />

      <aside
        className={`cart-sidebar ${isCartOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compra"
        aria-hidden={!isCartOpen}
      >
        <header className="cart-sidebar__header">
          <h2 className="cart-sidebar__titulo">Tu Carrito</h2>
          <button
            type="button"
            className="cart-sidebar__cerrar"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </header>

        <div className="cart-sidebar__contenido">
          {items.length === 0 ? (
            <p className="cart-sidebar__vacio">Tu carrito está vacío.</p>
          ) : (
            <ul className="cart-sidebar__items">
              {items.map((item) => (
                <li key={item.productoId} className="cart-sidebar__item">
                  <div className="cart-sidebar__item-imagen">
                    {item.imagen && (<img src={normalizarUrlMedia(item.imagen)} alt={item.nombre} />)}
                  </div>

                  <div className="cart-sidebar__item-info">
                    <p className="cart-sidebar__item-nombre">{item.nombre}</p>
                    <p className="cart-sidebar__item-precio">
                      {formatPrecio(item.precio)}
                    </p>

                    <div className="cart-sidebar__cantidad">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productoId, item.cantidad - 1)
                        }
                        aria-label={`Reducir cantidad de ${item.nombre}`}
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productoId, item.cantidad + 1)
                        }
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-sidebar__item-subtotal">
                      {formatPrecio(item.precio * item.cantidad)}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="cart-sidebar__eliminar"
                    onClick={() => removeItem(item.productoId)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-sidebar__footer">
            <div className="cart-sidebar__subtotal">
              <span>Subtotal</span>
              <strong>{formatPrecio(total)}</strong>
            </div>
            <button
              type="button"
              className="cart-sidebar__boton cart-sidebar__boton--secundario"
              onClick={handleVerCarrito}
            >
              VER CARRITO
            </button>
            <button
              type="button"
              className="cart-sidebar__boton cart-sidebar__boton--primario"
              onClick={handleFinalizarCompra}
            >
              FINALIZAR COMPRA
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}

export default CartSidebar