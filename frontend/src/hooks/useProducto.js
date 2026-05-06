import { useEffect, useState } from 'react'
import { getProductoBySlug } from '../services/productosService'

/**
 * Carga los datos de un producto por su slug.
 * Devuelve { producto, loading, error, notFound }.
 */
export default function useProducto(slug) {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return

    let cancelado = false
    setLoading(true)
    setError(null)
    setNotFound(false)

    getProductoBySlug(slug)
      .then((data) => {
        if (!cancelado) setProducto(data)
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

  return { producto, loading, error, notFound }
}