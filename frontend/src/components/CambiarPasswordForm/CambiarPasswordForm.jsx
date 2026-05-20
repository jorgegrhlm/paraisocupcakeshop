import { useState } from 'react'
import { cambiarPassword } from '../../services/authService'
import './CambiarPasswordForm.css'

// SVG inline del ojo abierto (acción: mostrar contraseña)
const IconoOjo = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// SVG inline del ojo tachado (acción: ocultar contraseña)
const IconoOjoTachado = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

/**
 * Bloque autocontenido para cambiar la contraseña del usuario logueado.
 * Tres inputs (actual, nueva, confirmación) cada uno con toggle de
 * visibilidad ("ojito"). Envía POST a /api/usuarios/cambiar-password/.
 */
function CambiarPasswordForm() {
  const [form, setForm] = useState({
    password_actual: '',
    password_nueva: '',
    password_nueva_confirm: '',
  })
  // Mapa de visibilidad: una flag por cada campo (el ojito alterna).
  const [visible, setVisible] = useState({
    password_actual: false,
    password_nueva: false,
    password_nueva_confirm: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)

  // Convierte la respuesta de error del backend (objeto con un mensaje
  // por campo, formato DRF) en un texto legible para el usuario.
  const formatearErrores = (data) => {
    if (!data) return 'Error desconocido.'
    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    return Object.entries(data)
      .map(([campo, msgs]) => {
        const texto = Array.isArray(msgs) ? msgs.join(' ') : String(msgs)
        return `• ${campo}: ${texto}`
      })
      .join('\n')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleVisible = (campo) => {
    setVisible((prev) => ({ ...prev, [campo]: !prev[campo] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)
    // Validación local antes de pegar al backend.
    if (form.password_nueva !== form.password_nueva_confirm) {
      setError('La nueva contraseña y su confirmación no coinciden.')
      return
    }
    setLoading(true)
    try {
      await cambiarPassword(form)
      setExito('Contraseña actualizada correctamente.')
      // Limpiamos el form para no dejar las contraseñas escritas.
      setForm({
        password_actual: '',
        password_nueva: '',
        password_nueva_confirm: '',
      })
    } catch (err) {
      setError(formatearErrores(err.response?.data))
    } finally {
      setLoading(false)
    }
  }

  // Helper para renderizar un campo con su ojito. Evita repetir 3 veces
  // la misma estructura JSX.
  const renderCampo = (label, name, autoComplete) => (
    <label className="auth-form__campo cambiar-password__campo">
      <span>{label}</span>
      <div className="cambiar-password__input-wrap">
        <input
          type={visible[name] ? 'text' : 'password'}
          name={name}
          value={form[name]}
          onChange={handleChange}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="cambiar-password__ojito"
          onClick={() => toggleVisible(name)}
          aria-label={
            visible[name] ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
        >
          {visible[name] ? <IconoOjoTachado /> : <IconoOjo />}
        </button>
      </div>
    </label>
  )

  return (
    <section className="cambiar-password">
      <h2 className="cambiar-password__titulo">Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {renderCampo('Contraseña actual', 'password_actual', 'current-password')}
        {renderCampo('Nueva contraseña', 'password_nueva', 'new-password')}
        {renderCampo(
          'Confirmar nueva contraseña',
          'password_nueva_confirm',
          'new-password'
        )}

        {error && <p className="auth-form__error">{error}</p>}
        {exito && <p className="auth-form__exito">{exito}</p>}

        <button
          type="submit"
          className="auth-form__submit"
          disabled={loading}
        >
          {loading ? 'Cambiando…' : 'Cambiar contraseña'}
        </button>
      </form>
    </section>
  )
}

export default CambiarPasswordForm