import { useState, useEffect } from 'react'

/**
 * Custom hook que ejecuta una función asíncrona al montar el componente
 * y devuelve { data, loading, error } para gestionar el estado de la petición.
 *
 * @param {Function} fetchFn - función async que devuelve datos
 * @param {Array} deps - dependencias (re-ejecuta la fetchFn si cambian)
 */
function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false

    setLoading(true)
    setError(null)

    fetchFn()
      .then((res) => {
        if (!cancelado) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err)
          setLoading(false)
        }
      })

    // Cleanup: si el componente se desmonta antes de que termine la petición,
    // ignoramos el resultado para evitar warnings de "setState en componente desmontado"
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}

export default useFetch