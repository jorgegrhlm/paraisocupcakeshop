import { createContext, useState, useMemo, useEffect } from 'react'

export const FavoritosContext = createContext(null)

const STORAGE_KEY = 'paraisoFavoritos'

// Lee la lista de favoritos del localStorage. Devuelve [] si no hay nada
// o si el JSON está corrupto.
const cargarFavoritosInicial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function FavoritosProvider({ children }) {
  // Cada favorito se guarda con la información mínima necesaria para
  // listarlo en la pantalla de Favoritos sin tener que volver a pedir
  // los datos al backend:
  // { productoId, slug, nombre, precio, imagen }
  const [favoritos, setFavoritos] = useState(cargarFavoritosInicial)

  // Persiste cualquier cambio en localStorage automáticamente.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos))
  }, [favoritos])

  // ¿Está este producto marcado como favorito?
  const esFavorito = (productoId) =>
    favoritos.some((f) => f.productoId === productoId)

  // Alterna entre añadir y quitar (lo que usaremos al pulsar el corazón).
  const toggleFavorito = (producto) => {
    setFavoritos((prev) => {
      const ya = prev.find((f) => f.productoId === producto.id)
      if (ya) {
        return prev.filter((f) => f.productoId !== producto.id)
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          precio: parseFloat(producto.precio),
          imagen: producto.imagen,
        },
      ]
    })
  }

  // Añade explícitamente (no toggle). No se usa mucho, pero útil para tests.
  const addFavorito = (producto) => {
    setFavoritos((prev) => {
      if (prev.some((f) => f.productoId === producto.id)) return prev
      return [
        ...prev,
        {
          productoId: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          precio: parseFloat(producto.precio),
          imagen: producto.imagen,
        },
      ]
    })
  }

  // Quita explícitamente.
  const removeFavorito = (productoId) => {
    setFavoritos((prev) => prev.filter((f) => f.productoId !== productoId))
  }

  // Vacía la lista entera.
  const clearFavoritos = () => setFavoritos([])

  // Total de favoritos (para el badge del Header).
  const count = useMemo(() => favoritos.length, [favoritos])

  const value = {
    favoritos,
    esFavorito,
    toggleFavorito,
    addFavorito,
    removeFavorito,
    clearFavoritos,
    count,
  }

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  )
}