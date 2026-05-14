import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Wrap a una ruta que SOLO deben ver los usuarios NO autenticados
 * (típicamente /login y /registro). Es el componente espejo de
 * ProtectedRoute.
 *
 * Comportamiento:
 *  - Mientras AuthContext está comprobando si hay sesión (loading=true)
 *    muestra un mensaje neutro, igual que ProtectedRoute. Esto evita un
 *    "flash" del formulario de login antes de saber si en realidad hay
 *    sesión activa.
 *  - Si hay sesión, redirige a la ruta de origen guardada en
 *    location.state.from (si la hay) o, en su defecto, a la home. Se
 *    usa replace=true para no contaminar el historial con la URL de
 *    /login a la que el usuario ya no debería volver con el botón
 *    "atrás" del navegador.
 *  - Si no hay sesión, renderiza los children normalmente.
 *
 * Uso:
 *   <Route path="/login" element={
 *     <PublicOnlyRoute><Login /></PublicOnlyRoute>
 *   } />
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando…</div>
  }

  if (isAuthenticated) {
    const destino = location.state?.from?.pathname || '/'
    return <Navigate to={destino} replace />
  }

  return children
}

export default PublicOnlyRoute