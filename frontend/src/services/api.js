import axios from 'axios'

// Mismas claves que usa AuthContext para guardar los tokens.
const ACCESS_KEY = 'paraisoAccess'
const REFRESH_KEY = 'paraisoRefresh'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================
// REQUEST INTERCEPTOR
// Antes de cada petición, inyecta el access token (si lo hay) en
// la cabecera Authorization. Así NO hay que recordarlo en cada
// llamada: todos los servicios (productosService, authService,
// categoriasService...) lo usan automáticamente.
// ============================================================
api.interceptors.request.use((config) => {
  const access = localStorage.getItem(ACCESS_KEY)
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// ============================================================
// RESPONSE INTERCEPTOR (refresh automático en 401)
// Cuando una petición devuelve 401 (access caducado o inválido),
// intentamos refrescar el access con el refresh token. Si va bien,
// reintentamos la petición original con el nuevo access. Si el
// refresh también falla, limpiamos los tokens (queda al user
// efectivamente fuera).
// ============================================================
let estaRefrescando = false
let colaPendiente = []

const procesarCola = (error, accessNuevo = null) => {
  colaPendiente.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(accessNuevo)
  })
  colaPendiente = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const peticionOriginal = error.config

    // Salir antes si: no es 401, ya hemos reintentado, o el 401
    // viene del propio /token/refresh/ (que no debe reintentarse).
    const debeRefrescar =
      error.response?.status === 401 &&
      !peticionOriginal._reintentado &&
      !peticionOriginal.url?.includes('/token/refresh/')

    if (!debeRefrescar) {
      return Promise.reject(error)
    }

    const refresh = localStorage.getItem(REFRESH_KEY)
    if (!refresh) {
      // Sin refresh: no podemos recuperar la sesión.
      return Promise.reject(error)
    }

    // Si ya hay un refresh en curso, encolamos esta petición.
    // Cuando el refresh termine, todas las peticiones encoladas
    // se reanudarán con el nuevo token.
    if (estaRefrescando) {
      return new Promise((resolve, reject) => {
        colaPendiente.push({ resolve, reject })
      }).then((accessNuevo) => {
        peticionOriginal.headers.Authorization = `Bearer ${accessNuevo}`
        return api(peticionOriginal)
      })
    }

    peticionOriginal._reintentado = true
    estaRefrescando = true

    try {
      // OJO: usamos axios "crudo" (no nuestra instancia api) para
      // evitar que este interceptor se aplique a la propia llamada
      // de refresh y se monte un bucle.
      const res = await axios.post('/api/token/refresh/', { refresh })
      const nuevoAccess = res.data.access
      localStorage.setItem(ACCESS_KEY, nuevoAccess)

      procesarCola(null, nuevoAccess)
      peticionOriginal.headers.Authorization = `Bearer ${nuevoAccess}`
      return api(peticionOriginal)
    } catch (refreshError) {
      // El refresh también falló: limpiamos sesión.
      procesarCola(refreshError, null)
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
      return Promise.reject(refreshError)
    } finally {
      estaRefrescando = false
    }
  }
)

export default api