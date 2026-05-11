import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Wrap a una ruta que solo deben ver los usuarios autenticados.
 *
 * Comportamiento:
 *  - Mientras AuthContext está comprobando si hay sesión (loading=true)
 *    muestra un mensaje neutro. Esto evita un "flash" de /login antes
 *    de saber si en realidad hay sesión.
 *  - Si no hay sesión, redirige a /login guardando la ruta original
 *    en location.state.from para que el Login pueda volver allí
 *    después del login (lo implementaremos en el Login).
 *  - Si hay sesión, renderiza los children normalmente.
 *
 * Uso:
 *   <Route path="/perfil" element={
 *     <ProtectedRoute><Perfil /></ProtectedRoute>
 *   } />
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute