import { useEffect, useState } from 'react'
import { getCategorias } from '../services/categoriasService'

// Caché a nivel de módulo: las categorías cambian rara vez, así que
// las pedimos una sola vez por sesión y compartimos el resultado.
let cacheCategorias = null
let promesaEnCurso = null

/**
 * Devuelve la lista completa de categorías.
 * El primer hook que se monta dispara la petición; el resto reutiliza la caché.
 */
export default function useCategorias() {
  const [categorias, setCategorias] = useState(cacheCategorias || [])
  const [loading, setLoading] = useState(!cacheCategorias)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cacheCategorias) return

    let cancelado = false
    if (!promesaEnCurso) {
      promesaEnCurso = getCategorias()
    }

    promesaEnCurso
      .then((data) => {
        cacheCategorias = data
        if (!cancelado) setCategorias(data)
      })
      .catch((err) => {
        promesaEnCurso = null
        if (!cancelado) setError(err)
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  return { categorias, loading, error }
}