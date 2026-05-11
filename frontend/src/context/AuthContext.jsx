import { createContext, useState, useEffect, useCallback } from 'react'
import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  updateMe as apiUpdateMe,
} from '../services/authService'

export const AuthContext = createContext(null)

// Claves usadas en localStorage para persistir los tokens entre sesiones.
const ACCESS_KEY = 'paraisoAccess'
const REFRESH_KEY = 'paraisoRefresh'

export function AuthProvider({ children }) {
  // Datos del usuario autenticado (null si no hay sesión activa)
  const [user, setUser] = useState(null)
  // True solo durante la carga inicial: hasta que sepamos si hay sesión
  // o no, no debemos redirigir a /login (el ProtectedRoute lo respeta)
  const [loading, setLoading] = useState(true)

  // Al montar el provider: si hay access token guardado, intentamos
  // recuperar los datos del usuario. Si falla (token expirado, usuario
  // borrado, etc.), limpiamos el localStorage y volvemos a estado anónimo.
  useEffect(() => {
    const access = localStorage.getItem(ACCESS_KEY)
    if (!access) {
      setLoading(false)
      return
    }

    let cancelado = false
    getMe()
      .then((data) => {
        if (!cancelado) setUser(data)
      })
      .catch(() => {
        if (!cancelado) {
          localStorage.removeItem(ACCESS_KEY)
          localStorage.removeItem(REFRESH_KEY)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  // Helpers privados (no se exponen)
  const guardarTokens = (access, refresh) => {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  }

  const limpiarTokens = () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  // Login: pide tokens al backend, los guarda y obtiene los datos del user
  const login = useCallback(async (credentials) => {
    const { access, refresh } = await apiLogin(credentials)
    guardarTokens(access, refresh)
    const userData = await getMe()
    setUser(userData)
    return userData
  }, [])

  // Registro: el backend devuelve user + tokens en la misma respuesta,
  // así que no hace falta una petición extra a /me/
  const register = useCallback(async (datos) => {
    const { user: userData, access, refresh } = await apiRegister(datos)
    guardarTokens(access, refresh)
    setUser(userData)
    return userData
  }, [])

  // Logout: limpiamos tokens y estado. No hay petición al backend
  // porque simplejwt sin blacklist no necesita invalidar nada en servidor.
  const logout = useCallback(() => {
    limpiarTokens()
    setUser(null)
  }, [])

  // Actualizar perfil propio (User + Perfil anidado)
  const updateUser = useCallback(async (datos) => {
    const updated = await apiUpdateMe(datos)
    setUser(updated)
    return updated
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}