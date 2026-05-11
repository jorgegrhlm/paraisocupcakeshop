import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import './Auth.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // URL a la que volver tras el login. Si llegamos aquí por el
  // ProtectedRoute, lo guardó en location.state.from. Si no, vamos
  // a la home.
  const desde = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ username, password })
      navigate(desde, { replace: true })
    } catch (err) {
      // simplejwt devuelve {detail: "No active account..."} en 401
      const detail = err.response?.data?.detail
      setError(detail || 'Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__titulo">Iniciar sesión</h1>
        <p className="auth-card__sub">
          Accede a tu cuenta para obtener mayores beneficios.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-form__campo">
            <span>Usuario</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </label>

          <label className="auth-form__campo">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-card__alt">
          ¿No tienes cuenta?{' '}
          <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </section>
  )
}

export default Login