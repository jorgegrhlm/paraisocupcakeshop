import { useLocation, useNavigate, Link } from 'react-router-dom'
import './ConfirmacionPedido.css'

// Diccionarios para mostrar etiquetas legibles a partir de los códigos del backend.
const METODOS_PAGO_LABELS = {
  tarjeta: 'Tarjeta de crédito',
  bizum: 'Bizum',
  transferencia: 'Transferencia bancaria',
}

const INTERVALOS_LABELS = {
  '09-12': '09:00 - 12:00',
  '12-15': '12:00 - 15:00',
  '15-18': '15:00 - 18:00',
  '18-21': '18:00 - 21:00',
}

function ConfirmacionPedido() {
  const location = useLocation()
  const navigate = useNavigate()
  // El pedido viene del state pasado por navigate() en Facturacion.jsx.
  // Si el usuario refresca o entra directo a la URL, será undefined.
  const pedido = location.state?.pedido

  const formatPrecio = (n) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(n) || 0)

  const formatFecha = (fechaISO) => {
    if (!fechaISO) return '—'
    const d = new Date(fechaISO)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  // Salvaguarda: entrada directa o refresh sin estado.
  if (!pedido) {
    return (
      <div className="confirmacion-page">
        <div className="confirmacion-page__sin-pedido">
          <h1 className="confirmacion-page__titulo">No hay ningún pedido que mostrar</h1>
          <p>
            Esta página solo se muestra después de completar una compra. Si has llegado
            aquí por error o has refrescado la pestaña, vuelve a la tienda para empezar
            un pedido nuevo.
          </p>
          <button
            type="button"
            className="confirmacion-page__boton-primario"
            onClick={() => navigate('/')}
          >
            VOLVER A LA TIENDA
          </button>
        </div>
      </div>
    )
  }

  // Cálculos derivados a partir del pedido recibido.
  const subtotal =
    pedido.lineas?.reduce((acc, l) => acc + (parseFloat(l.subtotal) || 0), 0) || 0
  const costoEnvio = parseFloat(pedido.costo_envio) || 0
  const totalAPagar = subtotal + costoEnvio

  // Construye una dirección completa multilínea a partir de los campos estructurados.
  const direccionFormateada = [
    pedido.direccion_envio,
    [pedido.codigo_postal, pedido.ciudad].filter(Boolean).join(' '),
    [pedido.estado_provincia, pedido.pais].filter(Boolean).join(', '),
  ]
    .filter((s) => s && s.trim())
    .join('\n')

  // Si pedido.usuario es null (anónimo), no mostramos "VER MIS PEDIDOS".
  const esUsuarioLogueado = !!pedido.usuario
  const metodoPagoLabel = METODOS_PAGO_LABELS[pedido.metodo_pago] || pedido.metodo_pago
  const intervaloLabel = INTERVALOS_LABELS[pedido.intervalo_entrega] || pedido.intervalo_entrega

  return (
    <div className="confirmacion-page">
      {/* Cabecera de éxito */}
      <header className="confirmacion-page__exito">
        <div className="confirmacion-page__check" aria-hidden="true">✓</div>
        <h1 className="confirmacion-page__titulo">¡Gracias, tu pedido se ha confirmado!</h1>
        {pedido.email_cliente && (
          <p className="confirmacion-page__subtitulo">
            Recibirás un email de confirmación en <strong>{pedido.email_cliente}</strong>.
          </p>
        )}
      </header>

      {/* Número de pedido */}
      <section className="confirmacion-page__numero">
        Pedido nº <strong>#{pedido.id}</strong>
      </section>

      {/* Simulacro de pago */}
      <section className="confirmacion-page__pago">
        <div className="confirmacion-page__pago-badge">Pago procesado correctamente</div>
        <div className="confirmacion-page__pago-metodo">
          Método de pago: <strong>{metodoPagoLabel}</strong>
        </div>
      </section>

      <div className="confirmacion-page__grid">
        {/* Resumen del pedido */}
        <section className="confirmacion-page__resumen">
          <h2 className="confirmacion-page__seccion-titulo">Resumen del pedido</h2>
          <ul className="confirmacion-page__lista">
            {pedido.lineas?.map((linea) => (
              <li key={linea.id} className="confirmacion-page__item">
                <span className="confirmacion-page__item-nombre">
                  {linea.producto_nombre} × {linea.cantidad}
                </span>
                <strong className="confirmacion-page__item-subtotal">
                  {formatPrecio(linea.subtotal)}
                </strong>
              </li>
            ))}
          </ul>
          <div className="confirmacion-page__fila">
            <span>Subtotal</span>
            <strong>{formatPrecio(subtotal)}</strong>
          </div>
          <div className="confirmacion-page__fila">
            <span>Envío</span>
            <strong>{formatPrecio(costoEnvio)}</strong>
          </div>
          <div className="confirmacion-page__fila confirmacion-page__fila--total">
            <span>Total</span>
            <strong>{formatPrecio(totalAPagar)}</strong>
          </div>
        </section>

        {/* Datos de entrega */}
        <section className="confirmacion-page__entrega">
          <h2 className="confirmacion-page__seccion-titulo">Datos de entrega</h2>
          <dl className="confirmacion-page__lista-datos">
            <dt>Destinatario</dt>
            <dd>{pedido.nombre_cliente || '—'}</dd>

            <dt>Dirección</dt>
            <dd className="confirmacion-page__direccion">{direccionFormateada || '—'}</dd>

            <dt>Teléfono</dt>
            <dd>{pedido.telefono_contacto || '—'}</dd>

            <dt>Fecha de entrega</dt>
            <dd>{formatFecha(pedido.fecha_entrega)}</dd>

            <dt>Franja horaria</dt>
            <dd>{intervaloLabel || '—'}</dd>

            {pedido.nota_pedido && (
              <>
                <dt>Nota</dt>
                <dd>{pedido.nota_pedido}</dd>
              </>
            )}
          </dl>
        </section>
      </div>

      {/* Acciones */}
      <div className="confirmacion-page__acciones">
        <button
          type="button"
          className="confirmacion-page__boton-primario"
          onClick={() => navigate('/')}
        >
          VOLVER A LA TIENDA
        </button>
        {esUsuarioLogueado && (
          <Link to="/perfil" className="confirmacion-page__boton-secundario">
            VER MIS PEDIDOS
          </Link>
        )}
      </div>
    </div>
  )
}

export default ConfirmacionPedido