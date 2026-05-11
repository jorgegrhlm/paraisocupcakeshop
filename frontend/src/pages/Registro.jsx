import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import './Auth.css'

/**
 * Convierte la respuesta de error del backend en un texto legible.
 * El backend devuelve un objeto del tipo {campo: ["mensaje", ...]}
 * cuando los serializers fallan. También puede devolver {detail: "..."}.
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

function Registro() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    telefono: '',
    direccion: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(form)
      // El backend ya devolvió los tokens y AuthContext nos dejó
      // autenticados. Vamos al inicio.
      navigate('/', { replace: true })
    } catch (err) {
      setError(formatearErrores(err.response?.data))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--ancha">
        <h1 className="auth-card__titulo">Crear cuenta</h1>
        <p className="auth-card__sub">
          Regístrate para para obtener mayores beneficios.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form__fila">
            <label className="auth-form__campo">
              <span>Usuario *</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
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
          </div>

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

          <div className="auth-form__fila">
            <label className="auth-form__campo">
              <span>Contraseña *</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </label>

            <label className="auth-form__campo">
              <span>Repetir contraseña *</span>
              <input
                type="password"
                name="password_confirm"
                value={form.password_confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </label>
          </div>

          <label className="auth-form__campo">
            <span>Teléfono</span>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              autoComplete="tel"
            />
          </label>

          <label className="auth-form__campo">
            <span>Dirección</span>
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              rows={2}
              autoComplete="street-address"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-card__alt">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  )
}

export default Registro