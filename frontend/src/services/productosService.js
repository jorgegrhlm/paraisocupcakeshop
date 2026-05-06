import api from './api'

export const getProductos = async (params = {}) => {
  const response = await api.get('/productos/', { params })
  return response.data
}

export const getProductoBySlug = async (slug) => {
  const response = await api.get(`/productos/${slug}/`)
  return response.data
}

export const getProductosDestacados = async () => {
  const response = await api.get('/productos/destacados/')
  return response.data
}

export const getCategorias = async () => {
  const response = await api.get('/categorias/')
  return response.data
}