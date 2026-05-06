import { createContext, useState, useMemo, useEffect } from 'react'

export const CartContext = createContext(null)

// Clave usada en localStorage para persistir el carrito entre sesiones.
const STORAGE_KEY = 'paraisoCart'

// Lee el carrito guardado en localStorage. Si no hay nada o el JSON
// está corrupto, devuelve una lista vacía.
const cargarCarritoInicial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(cargarCarritoInicial)

  // Cada vez que cambian los items, los persistimos.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.productoId === producto.id)
      if (existente) {
        return prev.map((i) =>
          i.productoId === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          precio: parseFloat(producto.precio),
          imagen: producto.imagen,
          cantidad,
        },
      ]
    })
  }

  const removeItem = (productoId) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))
  }

  const setQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeItem(productoId)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === productoId ? { ...i, cantidad } : i
      )
    )
  }

  const clearCart = () => setItems([])

  const count = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  )

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    [items]
  )

  const value = {
    items,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    count,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}