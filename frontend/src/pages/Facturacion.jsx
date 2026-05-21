import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'
import { crearPedido } from '../services/pedidosService'
import './Facturacion.css'

// Costo de envío fijo (igual que en Carrito.jsx).
const COSTO_ENVIO = 5

const METODOS_PAGO = [
  { value: 'tarjeta', label: 'Tarjeta de crédito' },
  { value: 'pagomovil', label: 'Pagomovil' },
  { value: 'transferencia', label: 'Transferencia' },
]

const MODOS_ENTREGA = [
  { value: 'envio', label: 'Envío a domicilio (+5,00 €)' },
  { value: 'recogida', label: 'Recoger en tienda (gratis)' },
]

const INTERVALOS = [
  { value: '09-12', label: '09:00 - 12:00' },
  { value: '12-15', label: '12:00 - 15:00' },
  { value: '15-18', label: '15:00 - 18:00' },
  { value: '18-21', label: '18:00 - 21:00' },
]

// Devuelve la fecha de hoy + n días en formato YYYY-MM-DD para los
// atributos min/max del input date.
const sumarDias = (n) => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + n)
  return fecha.toISOString().slice(0, 10)
}

// Estado inicial del formulario. Los campos nombre_usuario y contrasena son
// puramente cosméticos (aparecen en el mockup) — no se envían al backend.
// Sprint futuro: implementar registro durante checkout.
const ESTADO_FORM_INICIAL = {
  nombre_usuario: '',
  contrasena: '',
  nombre_cliente: '',
  telefono_contacto: '',
  email_cliente: '',
  estado_provincia: '',
  fecha_entrega: '',
  direccion_envio: '',
  codigo_postal: '',
  ciudad: '',
  pais: '',
  intervalo_entrega: '',
  nota_pedido: '',
  modo_entrega: 'envio',
  metodo_pago: 'tarjeta',
  acepta_politica: false,
}

function Facturacion() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [form, setForm] = useState(ESTADO_FORM_INICIAL)
  const [errors, setErrors] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  // Prerellena el formulario con los datos del usuario logueado.
  // Solo se rellenan los campos disponibles en User + Perfil:
  // nombre_usuario, nombre_cliente, email_cliente, telefono_contacto y
  // direccion_envio. Los demás (estado, ciudad, código postal, país,
  // fecha y franja de entrega) NO viven en el modelo de perfil, así que
  // los deja el usuario. El "|| prev.X" garantiza que no se pisan
  // ediciones manuales con valores vacíos del perfil.
  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      nombre_usuario: user.username || prev.nombre_usuario,
      nombre_cliente:
        [user.first_name, user.last_name].filter(Boolean).join(' ') ||
        prev.nombre_cliente,
      telefono_contacto: user.perfil?.telefono || prev.telefono_contacto,
      email_cliente: user.email || prev.email_cliente,
      direccion_envio: user.perfil?.direccion || prev.direccion_envio,
    }))
  }, [user?.id])

  const formatPrecio = (n) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(n)

  // Solo se cobra envío si el cliente elige enviar a domicilio.
  const conEnvio = form.modo_entrega === 'envio'
  const envio = items.length > 0 && conEnvio ? COSTO_ENVIO : 0
  const totalConEnvio = total + envio

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Validación local antes de enviar. Devuelve objeto { campo: mensaje }.
  // Los campos de dirección solo se exigen si el cliente elige envío
  // a domicilio. En recogida en tienda no se piden.
  const validar = () => {
    const e = {}
    const requeridosBase = [
      'nombre_cliente',
      'telefono_contacto',
      'email_cliente',
      'fecha_entrega',
      'intervalo_entrega',
    ]
    const requeridosEnvio = [
      'estado_provincia',
      'direccion_envio',
      'codigo_postal',
      'ciudad',
      'pais',
    ]
    const requeridos = conEnvio
      ? [...requeridosBase, ...requeridosEnvio]
      : requeridosBase
    requeridos.forEach((campo) => {
      if (!String(form[campo]).trim()) {
        e[campo] = 'Obligatorio'
      }
    })
    if (form.email_cliente && !form.email_cliente.includes('@')) {
      e.email_cliente = 'Email no válido'
    }
    if (!form.acepta_politica) {
      e.acepta_politica = 'Debes aceptar la política de privacidad'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorGeneral('')

    if (items.length === 0) {
      setErrorGeneral('Tu carrito está vacío. Vuelve a la tienda y añade productos.')
      return
    }

    const erroresValidacion = validar()
    if (Object.keys(erroresValidacion).length > 0) {
      setErrors(erroresValidacion)
      return
    }

    const payload = {
      nombre_cliente: form.nombre_cliente.trim(),
      email_cliente: form.email_cliente.trim(),
      telefono_contacto: form.telefono_contacto.trim(),
      direccion_envio: conEnvio ? form.direccion_envio.trim() : '',
      codigo_postal: conEnvio ? form.codigo_postal.trim() : '',
      ciudad: conEnvio ? form.ciudad.trim() : '',
      estado_provincia: conEnvio ? form.estado_provincia.trim() : '',
      pais: conEnvio ? form.pais.trim() : '',
      costo_envio: conEnvio ? COSTO_ENVIO.toFixed(2) : '0.00',
      metodo_pago: form.metodo_pago,
      fecha_entrega: form.fecha_entrega,
      intervalo_entrega: form.intervalo_entrega,
      nota_pedido: form.nota_pedido.trim(),
      lineas: items.map((i) => ({
        producto: i.productoId,
        cantidad: i.cantidad,
      })),
    }

    try {
      setEnviando(true)
      const pedido = await crearPedido(payload)
      // Limpiamos el carrito tras crear el pedido.
      clearCart()
      // Pasamos el pedido a la pantalla de Confirmación vía state.
      // /confirmacion-pedido se creará en la siguiente tarea del Sprint V.
      navigate('/confirmacion-pedido', { state: { pedido } })
    } catch (err) {
      console.error('Error creando pedido:', err)
      const detalle = err?.response?.data
      setErrorGeneral(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo crear el pedido. Revisa los datos e inténtalo de nuevo.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="facturacion-page">
      <header className="facturacion-page__header">
        <h1 className="facturacion-page__titulo">DETALLES DE FACTURACIÓN</h1>
        {!isAuthenticated && (
          <p className="facturacion-page__login">
            ¿Ya eres usuario? <Link to="/login">Accede</Link>
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <p className="facturacion-page__vacio">
          Tu carrito está vacío.{' '}
          <Link to="/">Vuelve a la tienda</Link> para añadir productos.
        </p>
      ) : (
        <form className="facturacion-page__contenido" onSubmit={handleSubmit} noValidate>
          {/* COLUMNA IZQUIERDA: form */}
          <section className="facturacion-page__form">
            <fieldset className="facturacion-page__pago facturacion-page__entrega">
              <legend>Modo de entrega</legend>
              {MODOS_ENTREGA.map((m) => (
                <label key={m.value} className="facturacion-page__pago-opcion">
                  <input
                    type="radio"
                    name="modo_entrega"
                    value={m.value}
                    checked={form.modo_entrega === m.value}
                    onChange={handleChange}
                  />
                  {m.label}
                </label>
              ))}
            </fieldset>

            <div className="facturacion-page__campos">
              <div className="facturacion-page__columna">
                <label>
                  Nombre de Usuario:
                  <input
                    type="text"
                    name="nombre_usuario"
                    value={form.nombre_usuario}
                    onChange={handleChange}
                    placeholder="(opcional)"
                  />
                </label>

                <label>
                  Nombre: *
                  <input
                    type="text"
                    name="nombre_cliente"
                    value={form.nombre_cliente}
                    onChange={handleChange}
                  />
                  {errors.nombre_cliente && (
                    <span className="facturacion-page__error">{errors.nombre_cliente}</span>
                  )}
                </label>

                <label>
                  Teléfono: *
                  <input
                    type="tel"
                    name="telefono_contacto"
                    value={form.telefono_contacto}
                    onChange={handleChange}
                  />
                  {errors.telefono_contacto && (
                    <span className="facturacion-page__error">{errors.telefono_contacto}</span>
                  )}
                </label>

                <label>
                  Correo: *
                  <input
                    type="email"
                    name="email_cliente"
                    value={form.email_cliente}
                    onChange={handleChange}
                  />
                  {errors.email_cliente && (
                    <span className="facturacion-page__error">{errors.email_cliente}</span>
                  )}
                </label>

                {conEnvio && (
                  <label>
                    Estado: *
                    <input
                      type="text"
                      name="estado_provincia"
                      value={form.estado_provincia}
                      onChange={handleChange}
                    />
                    {errors.estado_provincia && (
                      <span className="facturacion-page__error">{errors.estado_provincia}</span>
                    )}
                  </label>
                )}

                <label>
                  Fecha de Entrega: *
                  <input
                    type="date"
                    name="fecha_entrega"
                    value={form.fecha_entrega}
                    min={sumarDias(3)}
                    max={sumarDias(7)}
                    onChange={handleChange}
                  />
                  {errors.fecha_entrega && (
                    <span className="facturacion-page__error">{errors.fecha_entrega}</span>
                  )}
                </label>
              </div>

              <div className="facturacion-page__columna">
                <label>
                  Contraseña:
                  <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    placeholder="(opcional)"
                  />
                </label>

                {conEnvio && (
                  <label>
                    Dirección (nombre calle y número): *
                    <input
                      type="text"
                      name="direccion_envio"
                      value={form.direccion_envio}
                      onChange={handleChange}
                    />
                    {errors.direccion_envio && (
                      <span className="facturacion-page__error">{errors.direccion_envio}</span>
                    )}
                  </label>
                )}

                {conEnvio && (
                  <label>
                    Código postal: *
                    <input
                      type="text"
                      name="codigo_postal"
                      value={form.codigo_postal}
                      onChange={handleChange}
                    />
                    {errors.codigo_postal && (
                      <span className="facturacion-page__error">{errors.codigo_postal}</span>
                    )}
                  </label>
                )}

                {conEnvio && (
                  <label>
                    Ciudad: *
                    <input
                      type="text"
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                    />
                    {errors.ciudad && (
                      <span className="facturacion-page__error">{errors.ciudad}</span>
                    )}
                  </label>
                )}

                {conEnvio && (
                  <label>
                    País: *
                    <input
                      type="text"
                      name="pais"
                      value={form.pais}
                      onChange={handleChange}
                    />
                    {errors.pais && (
                      <span className="facturacion-page__error">{errors.pais}</span>
                    )}
                  </label>
                )}

                <label>
                  Intervalo de tiempo: *
                  <select
                    name="intervalo_entrega"
                    value={form.intervalo_entrega}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una franja</option>
                    {INTERVALOS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                  {errors.intervalo_entrega && (
                    <span className="facturacion-page__error">{errors.intervalo_entrega}</span>
                  )}
                </label>
              </div>
            </div>

            <label className="facturacion-page__nota">
              Nota del pedido (opcional)
              <textarea
                name="nota_pedido"
                value={form.nota_pedido}
                onChange={handleChange}
                rows={4}
              />
            </label>
          </section>

          {/* COLUMNA DERECHA: resumen del pedido */}
          <aside className="facturacion-page__resumen">
            <h2 className="facturacion-page__resumen-titulo">TU PEDIDO</h2>

            <div className="facturacion-page__resumen-cabecera">
              <span>PRODUCTO</span>
              <span>Subtotal</span>
            </div>

            <ul className="facturacion-page__resumen-lista">
              {items.map((item) => (
                <li key={item.productoId} className="facturacion-page__resumen-item">
                  <span>{item.nombre} × {item.cantidad}</span>
                  <strong>{formatPrecio(item.precio * item.cantidad)}</strong>
                </li>
              ))}
            </ul>

            <div className="facturacion-page__resumen-fila">
              <span>Subtotal</span>
              <strong>{formatPrecio(total)}</strong>
            </div>
            <div className="facturacion-page__resumen-fila">
              <span>Envío</span>
              <strong>
                {conEnvio ? formatPrecio(envio) : 'Gratis'}
              </strong>
            </div>
            <div className="facturacion-page__resumen-fila facturacion-page__resumen-fila--total">
              <span>Total</span>
              <strong>{formatPrecio(totalConEnvio)}</strong>
            </div>

            <fieldset className="facturacion-page__pago">
              <legend>Método de pago</legend>
              {METODOS_PAGO.map((m) => (
                <label key={m.value} className="facturacion-page__pago-opcion">
                  <input
                    type="radio"
                    name="metodo_pago"
                    value={m.value}
                    checked={form.metodo_pago === m.value}
                    onChange={handleChange}
                  />
                  {m.label}
                </label>
              ))}
            </fieldset>

            <label className="facturacion-page__politica">
              <input
                type="checkbox"
                name="acepta_politica"
                checked={form.acepta_politica}
                onChange={handleChange}
              />
              Acepto la política de privacidad *
            </label>
            {errors.acepta_politica && (
              <span className="facturacion-page__error">{errors.acepta_politica}</span>
            )}

            {errorGeneral && (
              <p className="facturacion-page__error-general">{errorGeneral}</p>
            )}

            <button
              type="submit"
              className="facturacion-page__boton-realizar"
              disabled={enviando}
            >
              {enviando ? 'PROCESANDO...' : 'REALIZAR PEDIDO'}
            </button>

            <button
              type="button"
              className="facturacion-page__boton-volver"
              onClick={() => navigate('/')}
            >
              VOLVER A LA TIENDA
            </button>

            <p className="facturacion-page__aviso">
              <strong>Importante:</strong> Tus datos personales se utilizarán para
              procesar tu pedido, mejorar tu experiencia en nuestra web y otros
              propósitos descritos en nuestra política de privacidad.
            </p>
          </aside>
        </form>
      )}
    </div>
  )
}

export default Facturacion