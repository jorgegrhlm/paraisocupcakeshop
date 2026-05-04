import { useEffect, useState } from 'react'
import { getCategoriaBySlug } from '../services/categoriasService'

/**
 * Carga los datos de una categoría por su slug.
 * Devuelve { categoria, loading, error, notFound }.
 */
export default function useCategoria(slug) {
  const [categoria, setCategoria] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return

    let cancelado = false
    setLoading(true)
    setError(null)
    setNotFound(false)

    getCategoriaBySlug(slug)
      .then((data) => {
        if (!cancelado) setCategoria(data)
      })
      .catch((err) => {
        if (cancelado) return
        if (err.response?.status === 404) {
          setNotFound(true)
        } else {
          setError(err)
        }
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [slug])

  return { categoria, loading, error, notFound }
}