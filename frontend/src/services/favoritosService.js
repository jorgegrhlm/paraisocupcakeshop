import api from './api'

/**
 * Lista los favoritos del usuario autenticado.
 *
 * El backend filtra por request.user y devuelve cada favorito con
 * los datos denormalizados del producto (nombre, slug, precio, imagen)
 * para evitar una segunda petición al catálogo.
 *
 * Si no hay sesión activa, la petición devolverá 401 y el interceptor
 * de api.js intentará refrescar el access token automáticamente. Si
 * el refresh también falla, propaga el error.
 *
 * Devuelve una lista de favoritos ordenada por fecha de creación
 * descendente (el más reciente primero).
 */
export const getFavoritos = async () => {
  const response = await api.get('/usuarios/favoritos/')
  return response.data
}

/**
 * Marca un producto como favorito del usuario autenticado.
 *
 * La operación es idempotente: si el producto ya estaba en favoritos,
 * el backend devuelve el favorito existente con código 200 OK en lugar
 * de error 400. El cliente puede invocar esta función sin comprobar
 * primero si ya existe.
 *
 * productoId: identificador numérico del producto.
 *
 * Devuelve el favorito (creado o existente) con los datos denormalizados
 * del producto.
 */
export const addFavorito = async (productoId) => {
  const response = await api.post('/usuarios/favoritos/', {
    producto: productoId,
  })
  return response.data
}

/**
 * Elimina un favorito por su id (el id del favorito, NO el del producto).
 *
 * Devuelve 204 No Content si todo va bien. Si el id no existe o no
 * pertenece al usuario actual, devuelve 404.
 */
export const removeFavorito = async (favoritoId) => {
  await api.delete(`/usuarios/favoritos/${favoritoId}/`)
}