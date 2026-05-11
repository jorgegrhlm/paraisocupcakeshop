import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './UserMenu.css'

/**
 * Menú de usuario en el Header.
 *
 * - Sin sesión: enlace simple "Iniciar sesión" → /login.
 * - Con sesión: botón con saludo y chevron que abre un desplegable
 *   con info del usuario, "Mi perfil" y "Cerrar sesión".
 *
 * Sigue el mismo patrón de interacción que CategoriasMenu:
 * cierre con click fuera, cierre con ESC.
 */
function UserMenu() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return
    const handleClickFuera = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [isOpen])

  // Cerrar con tecla ESC
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const cerrarMenu = () => setIsOpen(false)

  const handleLogout = () => {
    setIsOpen(false)
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      logout()
      navigate('/', { replace: true })
    }
  }

  // Iconos inline reutilizados
  const iconoPersona = (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="currentColor"
      />
    </svg>
  )

  const iconoChevron = (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path
        d="M2 4l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  // ===== Estado SIN sesión: enlace simple =====
  if (!isAuthenticated) {
    return (
      <Link to="/login" className="user-menu__login-link">
        {iconoPersona}
        <span className="user-menu__login-text">Iniciar sesión</span>
      </Link>
    )
  }

  // ===== Estado CON sesión: botón con dropdown =====
  const nombreVisible = user.first_name || user.username

  return (
    <div className="user-menu" ref={wrapperRef}>
      <button
        type="button"
        className={`user-menu__btn ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {iconoPersona}
        <span className="user-menu__nombre">Hola, {nombreVisible}</span>
        <span className={`user-menu__chevron ${isOpen ? 'is-open' : ''}`}>
          {iconoChevron}
        </span>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__info">
            <p className="user-menu__info-username">{user.username}</p>
            {user.email && (
              <p className="user-menu__info-email">{user.email}</p>
            )}
          </div>

          <Link
            to="/perfil"
            className="user-menu__item"
            onClick={cerrarMenu}
            role="menuitem"
          >
            Mi perfil
          </Link>

          <button
            type="button"
            className="user-menu__item user-menu__item--logout"
            onClick={handleLogout}
            role="menuitem"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu