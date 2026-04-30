/**
 * Convierte la URL absoluta de imagenes que devuelve Django
 * (con host backend:8000) en una URL relativa que el proxy de Vite
 * resuelve correctamente desde el navegador.
 *
 * Ejemplos:
 *   "http://backend:8000/media/productos/foto.png" -> "/media/productos/foto.png"
 *   "/media/productos/foto.png"                     -> "/media/productos/foto.png"
 *   null                                            -> null
 */
export function getImageUrl(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.pathname
  } catch {
    return url
  }
}