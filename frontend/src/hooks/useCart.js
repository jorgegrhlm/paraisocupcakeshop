import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

/**
 * Atajo para usar el carrito desde cualquier componente.
 * Devuelve { items, addItem, removeItem, setQuantity, clearCart, count, total }.
 *
 * Lanza error si se usa fuera de <CartProvider> (te avisa rápido si te
 * olvidaste de envolver la app en App.jsx).
 */
export default function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>')
  }
  return ctx
}