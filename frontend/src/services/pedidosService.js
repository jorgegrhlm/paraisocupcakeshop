import api from './api'

/**
 * Crea un pedido nuevo desde el carrito.
 *
 * datos = {
 *   direccion_envio: string,
 *   telefono_contacto: string,
 *   lineas: [{ producto: id, cantidad: int }, ...]
 * }
 *
 * El backend ignora cualquier 'usuario', 'estado', 'total' o
 * 'precio_unitario' que mande el cliente: pone el usuario del
 * token, estado 'pendiente' y calcula el total con los precios
 * reales de los productos.
 *
 * Devuelve el pedido creado con sus líneas serializadas.
 */
export const crearPedido = async (datos) => {
  const response = await api.post('/pedidos/', datos)
  return response.data
}