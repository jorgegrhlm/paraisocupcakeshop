import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
  const listaRef = useRef(null)
  const { pathname } = useLocation()

  // Coloca la barra mostrando la categoria en la que esta el usuario.
  // En movil la lista no cabe entera, asi que sin esto el elemento
  // marcado puede quedar fuera de la pantalla.
  useEffect(() => {
    const lista = listaRef.current
    if (!lista) return
    const activo = lista.querySelector('.is-activo')
    if (!activo) return
    // Se calcula el desplazamiento a mano en vez de usar scrollIntoView
    // porque ese metodo tambien mueve el scroll vertical de la pagina,
    // y aqui solo queremos mover la barra en horizontal.
    const destino = activo.offsetLeft - (lista.clientWidth - activo.clientWidth) / 2
    lista.scrollTo({ left: Math.max(0, destino), behavior: 'smooth' })
  }, [pathname, categorias])

  // Los hooks se llaman siempre; la salida temprana va despues de ellos.
  if (loading || error || categorias.length === 0) return null

  return (
    <nav className={`barra-categorias ${visible ? 'is-visible' : ''}`} aria-label="Categorías">
      <ul className="barra-categorias__lista" ref={listaRef}>
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