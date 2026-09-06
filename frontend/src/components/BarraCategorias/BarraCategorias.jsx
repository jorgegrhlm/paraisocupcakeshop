import { NavLink } from 'react-router-dom'
import useCategorias from '../../hooks/useCategorias'
import useScrolled from '../../hooks/useScrolled'
import './BarraCategorias.css'

/**
 * Barra de acceso rapido a las categorias.
 * Vive dentro del bloque fijo superior, justo debajo de la cabecera:
 * mientras la pagina esta arriba tiene altura cero y no ocupa nada.
 */
function BarraCategorias() {
  const { categorias, loading, error } = useCategorias()
  const visible = useScrolled()

  // Los hooks se llaman siempre; la salida temprana va despues de ellos.
  if (loading || error || categorias.length === 0) return null

  return (
    <nav className={`barra-categorias ${visible ? 'is-visible' : ''}`} aria-label="Categorías">
      <ul className="barra-categorias__lista">
        <li>
          <NavLink to="/" end className={({ isActive }) => `barra-categorias__item ${isActive ? 'is-activo' : ''}`}>
            Inicio
          </NavLink>
        </li>
        {categorias.map((cat) => (
          <li key={cat.id}>
            <NavLink to={`/categorias/${cat.slug}`} className={({ isActive }) => `barra-categorias__item ${isActive ? 'is-activo' : ''}`}>
              {cat.nombre}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BarraCategorias