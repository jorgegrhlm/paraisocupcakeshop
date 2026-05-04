import { useEffect, useState } from 'react'
import { getProductos } from '../services/productosService'

/**
 * Carga productos de una categoría aplicando filtros opcionales.
 *
 * @param {string} slug - slug de la categoría
 * @param {object} filtros - { ordering, soloDisponibles, soloDestacados }
 */
export default function useProductosPorCategoria(slug, filtros = {}) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { ordering, soloDisponibles, soloDestacados } = filtros

  useEffect(() => {
    if (!slug) return

    let cancelado = false
    setLoading(true)
    setError(null)

    const params = { categoria_slug: slug }
    if (ordering) params.ordering = ordering
    if (soloDisponibles) params.disponible = 'true'
    if (soloDestacados) params.destacado = 'true'

    getProductos(params)
      .then((data) => {
        if (!cancelado) setProductos(data)
      })
      .catch((err) => {
        if (!cancelado) setError(err)
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [slug, ordering, soloDisponibles, soloDestacados])

  return { productos, loading, error }
}