import api from './api'

export const getCategorias = async () => {
  const response = await api.get('/categorias/')
  return response.data
}

export const getCategoriaBySlug = async (slug) => {
  const response = await api.get(`/categorias/${slug}/`)
  return response.data
}