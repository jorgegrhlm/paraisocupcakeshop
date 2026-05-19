import { createContext, useState, useMemo, useEffect, useCallback } from 'react'
import useAuth from '../hooks/useAuth'
import {
  getFavoritos as apiGetFavoritos,
  addFavorito as apiAddFavorito,
  removeFavorito as apiRemoveFavorito,
} from '../services/favoritosService'

export const FavoritosContext = createContext(null)

// Clave usada en localStorage para persistir los favoritos del modo
// anónimo. Cuando el usuario se loguea, este storage se transfiere al
// backend y se limpia: en logueados, la fuente de verdad es el backend.
const STORAGE_KEY = 'paraisoFavoritos'

// ============================================================
// Helpers de normalización
// ============================================================

// Lee la lista guardada en localStorage. Devuelve [] si no hay nada
// o si el JSON está corrupto.
const cargarFavoritosLocal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Convierte un favorito devuelto por el backend a la shape interna.
// Añadimos favoritoId (id del registro Favorito en backend) que será
// necesario para hacer DELETE más tarde.
const desdeBackend = (favBackend) => ({
  favoritoId: favBackend.id,
  productoId: favBackend.producto,
  slug: favBackend.producto_slug,
  nombre: favBackend.producto_nombre,
  precio: parseFloat(favBackend.producto_precio),
  imagen: favBackend.producto_imagen,
})

// Convierte un producto del catálogo a la shape interna del contexto
// para el modo anónimo (sin id de favorito en backend).
const desdeProducto = (producto) => ({
  favoritoId: null,
  productoId: producto.id,
  slug: producto.slug,
  nombre: producto.nombre,
  precio: parseFloat(producto.precio),
  imagen: producto.imagen,
})

// Asegura que un favorito leído de localStorage tenga el nuevo campo
// favoritoId=null (compatibilidad con la versión previa al refactor).
const conFavoritoIdNull = (favLocal) => ({
  favoritoId: null,
  ...favLocal,
})

export function FavoritosProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const isAuthenticated = !!user

  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ============================================================
  // SINCRONIZACIÓN cuando cambia el estado de autenticación
  // ----
  // - Logout → user=null → carga localStorage (modo anónimo).
  // - Login  → user=obj  → trae backend, merge con localStorage, limpia
  //   localStorage para que las próximas sesiones anónimas empiecen
  //   vacías y los favoritos sean realmente "del usuario".
  // ============================================================
  useEffect(() => {
    // No hacer nada hasta que AuthContext resuelva si hay sesión o no.
    // Esto evita un "flash" de favoritos de localStorage antes de
    // cargarlos del backend.
    if (authLoading) return

    let cancelado = false

    const sincronizar = async () => {
      setLoading(true)
      setError(null)

      if (!isAuthenticated) {
        // Modo anónimo: trabajar solo con localStorage.
        if (!cancelado) {
          setFavoritos(cargarFavoritosLocal().map(conFavoritoIdNull))
          setLoading(false)
        }
        return
      }

      // Modo logueado: traer del backend y mergear con localStorage.
      try {
        const backendFavs = await apiGetFavoritos()
        const localFavs = cargarFavoritosLocal()

        // Subir al backend los favoritos locales que aún no estén allí.
        const idsEnBackend = new Set(backendFavs.map((f) => f.producto))
        const subidos = []
        for (const local of localFavs) {
          if (idsEnBackend.has(local.productoId)) continue
          try {
            const nuevo = await apiAddFavorito(local.productoId)
            subidos.push(nuevo)
          } catch (e) {
            console.warn('No se pudo migrar favorito local al backend:', local, e)
          }
        }

        // Vaciar el storage anónimo: a partir de ahora la verdad vive
        // en backend.
        localStorage.removeItem(STORAGE_KEY)

        if (!cancelado) {
          setFavoritos([...backendFavs, ...subidos].map(desdeBackend))
        }
      } catch (err) {
        // Red de seguridad: si el backend falla, fallback a localStorage
        // para que el usuario no quede sin favoritos visibles.
        console.warn('Error sincronizando favoritos con backend:', err)
        if (!cancelado) {
          setError('No se pudieron cargar tus favoritos desde el servidor.')
          setFavoritos(cargarFavoritosLocal().map(conFavoritoIdNull))
        }
      } finally {
        if (!cancelado) setLoading(false)
      }
    }

    sincronizar()
    return () => {
      cancelado = true
    }
  }, [isAuthenticated, authLoading])

  // ============================================================
  // PERSISTENCIA en localStorage (solo en modo anónimo)
  // ============================================================
  useEffect(() => {
    // No persistir mientras AuthContext está cargando, ni cuando hay
    // sesión activa: el origen de verdad en logueados es el backend.
    if (authLoading || isAuthenticated) return
    const paraLocal = favoritos.map(({ favoritoId, ...rest }) => rest)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paraLocal))
  }, [favoritos, isAuthenticated, authLoading])

  // ============================================================
  // API PÚBLICA (misma firma que antes, ahora con async donde toca)
  // ============================================================

  const esFavorito = useCallback(
    (productoId) => favoritos.some((f) => f.productoId === productoId),
    [favoritos]
  )

  const addFavorito = useCallback(
    async (producto) => {
      // Si ya está, no hacemos nada (consistente con el comportamiento previo).
      if (favoritos.some((f) => f.productoId === producto.id)) return

      if (isAuthenticated) {
        try {
          const nuevo = await apiAddFavorito(producto.id)
          setFavoritos((prev) => [...prev, desdeBackend(nuevo)])
        } catch (err) {
          setError('No se pudo añadir a favoritos.')
          throw err
        }
      } else {
        setFavoritos((prev) => [...prev, desdeProducto(producto)])
      }
    },
    [favoritos, isAuthenticated]
  )

  const removeFavorito = useCallback(
    async (productoId) => {
      const existente = favoritos.find((f) => f.productoId === productoId)
      if (!existente) return

      if (isAuthenticated && existente.favoritoId) {
        try {
          await apiRemoveFavorito(existente.favoritoId)
        } catch (err) {
          setError('No se pudo eliminar de favoritos.')
          throw err
        }
      }
      setFavoritos((prev) => prev.filter((f) => f.productoId !== productoId))
    },
    [favoritos, isAuthenticated]
  )

  const toggleFavorito = useCallback(
    async (producto) => {
      const ya = favoritos.some((f) => f.productoId === producto.id)
      if (ya) {
        await removeFavorito(producto.id)
      } else {
        await addFavorito(producto)
      }
    },
    [favoritos, addFavorito, removeFavorito]
  )

  const clearFavoritos = useCallback(async () => {
    if (isAuthenticated) {
      // Borrar todos los favoritos en backend, uno a uno.
      for (const fav of favoritos) {
        if (fav.favoritoId) {
          try {
            await apiRemoveFavorito(fav.favoritoId)
          } catch (e) {
            console.warn('Error borrando favorito en backend:', fav, e)
          }
        }
      }
    }
    setFavoritos([])
  }, [favoritos, isAuthenticated])

  const count = useMemo(() => favoritos.length, [favoritos])

  const value = {
    favoritos,
    loading,
    error,
    count,
    esFavorito,
    toggleFavorito,
    addFavorito,
    removeFavorito,
    clearFavoritos,
  }

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  )
}