import useFetch from './useFetch'
import { getProductosDestacados } from '../services/productosService'

function useProductosDestacados() {
  return useFetch(getProductosDestacados)
}

export default useProductosDestacados