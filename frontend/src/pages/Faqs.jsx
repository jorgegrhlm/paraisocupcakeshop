import './Estatica.css'

// Preguntas frecuentes pensadas para un e-commerce de cupcakes y tartas
// con entrega física. Listado mantenible: añadir o quitar items aquí.
const PREGUNTAS = [
  {
    pregunta: '¿En qué zonas hacen entregas?',
    respuesta:
      'Realizamos entregas en Maracay: Municipios Girardot, Mario Briceño Iragorry, Francisco Linares Alcantara, Libertador, Santiago Mariño. Para envíos fuera de estas zonas, contáctanos previamente por correo electrónico para confirmar disponibilidad y plazos.',
  },
  {
    pregunta: '¿Con cuánta antelación tengo que hacer mi pedido?',
    respuesta:
      'Para pedidos estándar recomendamos al menos 3 dias de antelación. Tortas personalizadas o pedidos especiales pueden requerir entre 6 y 7 días según el diseño solicitado.',
  },
  {
    pregunta: '¿Aceptan cupcakes y tortas personalizados?',
    respuesta:
      'Sí. Para diseños personalizados (color, decoración, mensaje en la tarta…) escríbenos a nuestro whatsapp ó a nuestro correo magglisramirez@gmail.com con todos los detalles y te enviaremos un presupuesto a medida.',
  },
  {
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta:
      'Aceptamos efectivo, Pagomovil y transferencias bancarias. Puedes elegir el método al finalizar la compra.',
  },
  {
    pregunta: '¿Tienen opciones sin gluten, sin lactosa o veganas?',
    respuesta:
      'Nuestros productos del catálogo no están etiquetados como aptos para dietas especiales. Si necesitas algo a medida, podemos preparar opciones sin gluten, sin lactosa o veganas con un mínimo de 3 dias de antelación.',
  },
  {
    pregunta: '¿Puedo cancelar o modificar mi pedido?',
    respuesta:
      'Puedes modificar tu pedido hasta 1 dia antes de la fecha de entrega elegida. Pasado ese plazo, al haber comenzado ya la elaboración, no podemos garantizar la cancelación.',
  },
]

function Faqs() {
  return (
    <article className="estatica">
      <h1 className="estatica__titulo">Preguntas frecuentes</h1>
      <p className="estatica__intro">
        Aquí tienes las preguntas más habituales de nuestros clientes. Si
        no encuentras la respuesta que buscas, escríbenos a través de la
        página de contacto.
      </p>

      <section className="estatica__seccion">
        {PREGUNTAS.map((item, i) => (
          <div key={i} className="estatica__faq">
            <p className="estatica__faq-pregunta">{item.pregunta}</p>
            <p className="estatica__faq-respuesta">{item.respuesta}</p>
          </div>
        ))}
      </section>
    </article>
  )
}

export default Faqs