import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Atajo para usar la sesión desde cualquier componente.
 * Devuelve { user, isAuthenticated, loading, login, register, logout,
 *           updateUser }.
 *
 * Lanza error si se usa fuera de <AuthProvider> (te avisa rápido si
 * te olvidaste de envolver la app en App.jsx, igual que useCart y
 * useFavoritos).
 */
export default function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return ctx
}