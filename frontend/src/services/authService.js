import api from './api'

/**
 * Inicia sesión con username + password.
 * Devuelve { access, refresh } directamente desde el endpoint estándar
 * de simplejwt en el backend.
 */
export const login = async (credentials) => {
  const response = await api.post('/token/', credentials)
  return response.data
}

/**
 * Refresca el access token usando el refresh.
 * Lo usa el interceptor de axios cuando una petición devuelve 401.
 */
export const refreshAccess = async (refreshToken) => {
  const response = await api.post('/token/refresh/', { refresh: refreshToken })
  return response.data
}

/**
 * Registra un usuario nuevo. El backend devuelve { user, access, refresh }
 * para que el cliente quede autenticado inmediatamente sin necesidad
 * de hacer login después.
 */
export const register = async (datos) => {
  const response = await api.post('/usuarios/registro/', datos)
  return response.data
}

/**
 * Datos del usuario autenticado actual (incluye perfil anidado).
 * Requiere que el access token esté en la cabecera Authorization
 * (de eso se encarga el interceptor de api.js).
 */
export const getMe = async () => {
  const response = await api.get('/usuarios/me/')
  return response.data
}

/**
 * Actualiza los datos del usuario autenticado (User + Perfil).
 * datos puede ser parcial; usar PATCH para actualización parcial.
 */
export const updateMe = async (datos) => {
  const response = await api.patch('/usuarios/me/', datos)
  return response.data
}

/**
 * Cambia la contraseña del usuario autenticado.
 * Lo usaremos en Sprint IV en la pantalla de Perfil.
 */
export const cambiarPassword = async (datos) => {
  const response = await api.post('/usuarios/cambiar-password/', datos)
  return response.data
}