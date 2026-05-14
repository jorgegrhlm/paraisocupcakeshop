import api from './api'

/**
 * Crea un pedido nuevo desde el carrito.
 *
 * datos = {
 *   nombre_cliente, email_cliente, telefono_contacto,
 *   direccion_envio, codigo_postal, ciudad, estado_provincia, pais,
 *   costo_envio, metodo_pago, fecha_entrega, intervalo_entrega,
 *   nota_pedido,
 *   lineas: [{ producto: id, cantidad: int }, ...]
 * }
 *
 * El backend asigna usuario (si la sesión está iniciada) o null
 * (compra anónima), pone estado='pendiente' y calcula el total con
 * los precios reales de los productos del catálogo.
 *
 * Devuelve el pedido creado con sus líneas serializadas.
 */
export const crearPedido = async (datos) => {
  const response = await api.post('/pedidos/', datos)
  return response.data
}

/**
 * Lista los pedidos del usuario autenticado.
 *
 * El backend filtra por request.user en get_queryset(), así que cada
 * usuario solo ve los suyos. Si no hay sesión activa, la petición
 * devolverá 401 y el interceptor de api.js intentará refrescar el
 * access token automáticamente.
 *
 * Devuelve una lista de pedidos ordenada por fecha de creación
 * descendente (el más reciente primero), tal como define el Meta
 * del modelo Pedido.
 */
export const getMisPedidos = async () => {
  const response = await api.get('/pedidos/')
  return response.data
}

/**
 * Detalle de un pedido por id (solo del usuario autenticado).
 *
 * Reservado para una futura pantalla de detalle de pedido pasado.
 * En el Sprint V no se usa todavía, pero queda preparado.
 */
export const getPedido = async (id) => {
  const response = await api.get(`/pedidos/${id}/`)
  return response.data
}