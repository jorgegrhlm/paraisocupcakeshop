// ---------------------------------------------------------------------------
// Configuracion de la tienda.
// Punto unico de verdad para el modo de venta y para los datos de contacto.
// ---------------------------------------------------------------------------

// Interruptor maestro.
//   false -> la web funciona como catalogo: sin precios, sin carrito, sin checkout.
//   true  -> vuelve a ser una tienda online completa.
// Vite sustituye las variables VITE_* al COMPILAR, no al arrancar: si cambias
// este valor hay que reconstruir el frontend para que surta efecto.
export const MOSTRAR_PRECIOS = import.meta.env.VITE_MOSTRAR_PRECIOS === 'true';

// Datos de contacto de la pasteleria. Provisionales hasta tener los definitivos.
export const CONTACTO = {
  whatsapp: import.meta.env.VITE_WHATSAPP ?? '+584127825317',
  email: import.meta.env.VITE_EMAIL ?? 'magglisramirez1@gmail.com',
};

// WhatsApp exige el numero sin +, sin espacios y sin guiones.
export const whatsappUrl = (mensaje = 'Hola, me gustaria consultar el precio de un producto.') =>
  `https://wa.me/${CONTACTO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;

export const mailtoUrl = (asunto = 'Consulta de precio') =>
  `mailto:${CONTACTO.email}?subject=${encodeURIComponent(asunto)}`;