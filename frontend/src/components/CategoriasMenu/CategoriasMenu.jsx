import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useCategorias from '../../hooks/useCategorias'
import Icon from '../Header/Icon'
import { getImageUrl } from '../../utils/getImageUrl'
import './CategoriasMenu.css'

/**
 * Botón "CATEGORÍAS" del Header con dropdown.
 *
 * Props:
 *  - buttonClassName: clases CSS aplicadas al botón (para que herede los
 *    estilos del Header sin duplicar CSS).
 */
function CategoriasMenu({ buttonClassName = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const { categorias, loading, error } = useCategorias()

  // Cerrar al hacer click fuera
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

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const cerrarMenu = () => setIsOpen(false)

  return (
    <div className="categorias-menu" ref={wrapperRef}>
      <button
        type="button"
        className={`categorias-menu__btn ${buttonClassName}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        CATEGORÍAS
        <span
          className={`categorias-menu__chevron ${isOpen ? 'is-open' : ''}`}
          aria-hidden="true"
        >
          <Icon name="chevron-down" />
        </span>
      </button>

      {isOpen && (
        <div className="categorias-menu__dropdown" role="menu">
          {loading && (
            <p className="categorias-menu__estado">Cargando…</p>
          )}

          {error && (
            <p className="categorias-menu__estado categorias-menu__estado--error">
              No se pudieron cargar las categorías.
            </p>
          )}

          {!loading && !error && categorias.length === 0 && (
            <p className="categorias-menu__estado">No hay categorías.</p>
          )}

          {!loading && !error && categorias.length > 0 && (
              <ul className="categorias-menu__lista">
              <li>
                <Link
                  to="/"
                  className="categorias-menu__item"
                  onClick={cerrarMenu}
                  role="menuitem"
                >
                  <span className="categorias-menu__item-nombre">Inicio</span>
                </Link>
              </li>
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/categorias/${cat.slug}`}
                    className="categorias-menu__item"
                    onClick={cerrarMenu}
                    role="menuitem"
                  >
                    {cat.imagen && (
                      <img
                        src={getImageUrl(cat.imagen)}
                        alt=""
                        className="categorias-menu__item-img"
                      />
                    )}
                    <span className="categorias-menu__item-nombre">
                      {cat.nombre}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoriasMenu