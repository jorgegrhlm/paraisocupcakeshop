import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getMisPedidos } from '../services/pedidosService'
import './Auth.css'

/**
 * Misma utilidad que en Registro: convierte la respuesta de error
 * del backend en un texto legible para el usuario.
 */
const formatearErrores = (data) => {
  if (!data) return 'Error desconocido'
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (typeof data === 'object') {
    return Object.entries(data)
      .map(([campo, msgs]) => {
        const texto = Array.isArray(msgs) ? msgs.join(' ') : String(msgs)
        return `• ${campo}: ${texto}`
      })
      .join('\n')
  }
  return 'Error desconocido'
}

// Etiquetas humanas para los estados del modelo Pedido.
const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

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
    month: '2-digit',
    year: 'numeric',
  })
}

function Perfil() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    perfil: { telefono: '', direccion: '' },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)

  // Estado para el historial de pedidos del usuario.
  const [pedidos, setPedidos] = useState([])
  const [pedidosLoading, setPedidosLoading] = useState(true)
  const [pedidosError, setPedidosError] = useState(null)

  // Sincronizar el formulario con los datos del usuario al cargar
  // o si user cambia (por ejemplo, al volver de actualizar).
  useEffect(() => {
    if (!user) return
    setForm({
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      perfil: {
        telefono: user.perfil?.telefono || '',
        direccion: user.perfil?.direccion || '',
      },
    })
  }, [user])

  // Cargar los pedidos del usuario al montar la pantalla.
  useEffect(() => {
    let cancelado = false
    setPedidosLoading(true)
    setPedidosError(null)
    getMisPedidos()
      .then((data) => {
        if (!cancelado) setPedidos(data)
      })
      .catch((err) => {
        if (!cancelado) {
          setPedidosError(
            err?.response?.data?.detail || 'No se pudieron cargar tus pedidos.'
          )
        }
      })
      .finally(() => {
        if (!cancelado) setPedidosLoading(false)
      })
    return () => {
      cancelado = true
    }
  }, [])

  // Manejador genérico para todos los inputs. Soporta los campos del
  // perfil anidado usando el prefijo "perfil." en el atributo name.
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('perfil.')) {
      const campo = name.slice('perfil.'.length)
      setForm((prev) => ({
        ...prev,
        perfil: { ...prev.perfil, [campo]: value },
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)
    setLoading(true)
    try {
      await updateUser(form)
      setExito('Perfil actualizado correctamente.')
    } catch (err) {
      setError(formatearErrores(err.response?.data))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      logout()
      navigate('/', { replace: true })
    }
  }

  // Calcula el total a pagar de un pedido (subtotal de líneas + envío).
  // El backend almacena total como suma de líneas; costo_envio va aparte.
  // Replicamos aquí la fórmula usada en Confirmación y Carrito.
  const totalAPagar = (pedido) => {
    const total = parseFloat(pedido.total) || 0
    const envio = parseFloat(pedido.costo_envio) || 0
    return total + envio
  }

  // ProtectedRoute ya garantiza que user existe, pero por robustez
  // devolvemos null si por alguna razón viene vacío.
  if (!user) return null

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--ancha">
        <h1 className="auth-card__titulo">Mi perfil</h1>
        <p className="auth-card__sub">
          Hola {user.first_name || user.username}, gestiona aquí tus datos.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-form__campo">
            <span>Usuario</span>
            <input type="text" value={user.username} readOnly disabled />
          </label>

          <label className="auth-form__campo">
            <span>Correo electrónico *</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <div className="auth-form__fila">
            <label className="auth-form__campo">
              <span>Nombre</span>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                autoComplete="given-name"
              />
            </label>

            <label className="auth-form__campo">
              <span>Apellidos</span>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="auth-form__campo">
            <span>Teléfono</span>
            <input
              type="tel"
              name="perfil.telefono"
              value={form.perfil.telefono}
              onChange={handleChange}
              autoComplete="tel"
            />
          </label>

          <label className="auth-form__campo">
            <span>Dirección</span>
            <textarea
              name="perfil.direccion"
              value={form.perfil.direccion}
              onChange={handleChange}
              rows={2}
              autoComplete="street-address"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}
          {exito && <p className="auth-form__exito">{exito}</p>}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={loading}
          >
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>

        {/* Historial de pedidos del usuario */}
        <section className="perfil-pedidos">
          <h2 className="perfil-pedidos__titulo">Mis pedidos</h2>

          {pedidosLoading && (
            <p className="perfil-pedidos__mensaje">Cargando pedidos…</p>
          )}

          {!pedidosLoading && pedidosError && (
            <p className="perfil-pedidos__error">{pedidosError}</p>
          )}

          {!pedidosLoading && !pedidosError && pedidos.length === 0 && (
            <p className="perfil-pedidos__mensaje">
              Aún no has realizado ningún pedido.
            </p>
          )}

          {!pedidosLoading && !pedidosError && pedidos.length > 0 && (
            <div className="perfil-pedidos__tabla-wrapper">
              <table className="perfil-pedidos__tabla">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{formatFecha(p.creado)}</td>
                      <td>{p.lineas?.length || 0}</td>
                      <td>{formatPrecio(totalAPagar(p))}</td>
                      <td>
                        <span
                          className={`perfil-pedidos__estado perfil-pedidos__estado--${p.estado}`}
                        >
                          {ESTADO_LABELS[p.estado] || p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="auth-card__alt">
          <button
            type="button"
            onClick={handleLogout}
            className="perfil-logout-link"
          >
            Cerrar sesión
          </button>
        </p>
      </div>
    </section>
  )
}

export default Perfil