import { useContext } from 'react'
import { FavoritosContext } from '../context/FavoritosContext'

/**
 * Atajo para usar la lista de favoritos desde cualquier componente.
 * Devuelve { favoritos, esFavorito, toggleFavorito, addFavorito,
 *           removeFavorito, clearFavoritos, count }.
 *
 * Lanza error si se usa fuera de <FavoritosProvider> (te avisa rápido
 * si te olvidaste de envolver la app en App.jsx, igual que useCart).
 */
export default function useFavoritos() {
  const ctx = useContext(FavoritosContext)
  if (!ctx) {
    throw new Error('useFavoritos debe usarse dentro de un <FavoritosProvider>')
  }
  return ctx
}