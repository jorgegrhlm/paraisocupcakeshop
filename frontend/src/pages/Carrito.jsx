import { useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'
import { getImageUrl } from '../utils/getImageUrl'
import './Carrito.css'


function Carrito() {
  const { items, setQuantity, removeItem, total } = useCart()
  const navigate = useNavigate()

  const formatPrecio = (n) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(n)



  // Navegación al checkout. La pantalla Facturación se hará en Sprint V;
  // hasta entonces dará 404 (esperado).
  const handleFinalizarCompra = () => {
    navigate('/facturacion')
  }

  return (
    <div className="carrito-page">
      <h1 className="carrito-page__titulo">CARRITO</h1>

      {items.length === 0 ? (
        <p className="carrito-page__vacio">
          No tienes productos en el carrito.
        </p>
      ) : (
        <>
          <table className="carrito-page__tabla">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productoId}>
                  <td className="carrito-page__td-imagen">
                    {item.imagen && (
                      <img
                        src={getImageUrl(item.imagen)}
                        alt={item.nombre}
                        className="carrito-page__imagen"
                      />
                    )}
                  </td>
                  <td className="carrito-page__td-nombre">{item.nombre}</td>
                  <td className="carrito-page__td-precio">
                    {formatPrecio(item.precio)}
                  </td>
                  <td>
                    <div className="carrito-page__cantidad">
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
                  </td>
                  <td className="carrito-page__td-subtotal">
                    {formatPrecio(item.precio * item.cantidad)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="carrito-page__eliminar"
                      onClick={() => removeItem(item.productoId)}
                      aria-label={`Eliminar ${item.nombre} del carrito`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <section className="carrito-page__totales">
            <h2 className="carrito-page__totales-titulo">TOTALES DEL CARRITO</h2>

            <div className="carrito-page__totales-fila carrito-page__totales-fila--total">
              <span>Subtotal</span>
              <strong>{formatPrecio(total)}</strong>
            </div>

            <p className="carrito-page__totales-nota">
              Los gastos de envío se calculan al finalizar la compra.
            </p>
          </section>

          <button
            type="button"
            className="carrito-page__boton-finalizar"
            onClick={handleFinalizarCompra}
          >
            FINALIZAR COMPRA
          </button>
        </>
      )}
    </div>
  )
}

export default Carrito