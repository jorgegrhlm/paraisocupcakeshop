import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Estatica.css'

function Legal() {
  const { hash } = useLocation()

  // Cuando se entra a /legal#privacidad (o cualquier otra ancla) desde
  // otra página, React Router cambia la URL pero NO hace scroll al
  // elemento. Lo resolvemos manualmente al montar el componente o
  // cada vez que cambia el hash.
  useEffect(() => {
    if (!hash) return
    const elemento = document.getElementById(hash.slice(1))
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <article className="estatica">
      <h1 className="estatica__titulo">Información legal</h1>
      <p className="estatica__intro">
        Esta página recoge los textos legales aplicables al sitio web de
        Paraíso Cupcake Shop. Datos identificativos ficticios incluidos a
        efectos del Trabajo de Fin de Grado.
      </p>

      <section id="aviso-legal" className="estatica__seccion">
        <h2>Aviso legal</h2>
        <p>
          En cumplimiento de lo establecido en la Ley 34/2002, de 11 de
          julio, de Servicios de la Sociedad de la Información y de
          Comercio Electrónico (LSSI-CE), se informa de los datos del
          titular del sitio web:
        </p>
        <ul>
          <li><strong>Denominación:</strong> Paraíso Cupcake Shop</li>
          <li><strong>CIF:</strong> J-40836218-0</li>
          <li><strong>Domicilio:</strong> Calle San Juan Nro 17, 2103 Maracay (Venezuela)</li>
          <li><strong>Correo electrónico:</strong> magglisramirez1@gmail.com</li>
        </ul>
        <p>
          El acceso al sitio implica la aceptación de las presentes
          condiciones. Paraíso Cupcake Shop se reserva el derecho a
          modificar el contenido del sitio sin previo aviso.
        </p>
      </section>

      <section id="privacidad" className="estatica__seccion">
        <h2>Política de privacidad</h2>
        <p>
          De acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley
          Orgánica 3/2018 de Protección de Datos Personales, los datos
          personales facilitados mediante el formulario de registro o de
          pedido serán tratados con las siguientes finalidades:
        </p>
        <ul>
          <li>Gestión del registro de usuarios y mantenimiento de la cuenta.</li>
          <li>Procesamiento de los pedidos realizados a través de la tienda.</li>
          <li>Envío de comunicaciones relativas al estado del pedido.</li>
        </ul>
        <p>
          El usuario podrá ejercer en cualquier momento sus derechos de
          acceso, rectificación, supresión, oposición, limitación del
          tratamiento y portabilidad escribiendo a{' '}
          <a href="mailto:contacto@paraisocupcakeshop.com">
            contacto@paraisocupcakeshop.com
          </a>.
        </p>
      </section>

      <section id="terminos" className="estatica__seccion">
        <h2>Términos y condiciones</h2>
                <h3>1. Objeto</h3>
        <p>
          Las presentes condiciones regulan el uso del sitio web de Paraíso
          Cupcake Shop, que funciona como catálogo de productos. La
          contratación no se realiza en línea: los pedidos se acuerdan
          directamente con la pastelería.
        </p>
        <h3>2. Precios y presupuestos</h3>
        <p>
          Los productos se elaboran por encargo, de modo que el precio
          depende del tamaño, los sabores, la decoración y la fecha de
          entrega. Por ese motivo el catálogo no muestra precios: el cliente
          solicita un presupuesto por WhatsApp o correo electrónico y la
          pastelería se lo confirma antes de aceptar el pedido.
        </p>
        <h3>3. Plazos de entrega</h3>
        <p>
          El plazo de entrega se acuerda con el cliente al confirmar el
          presupuesto, en función del tipo de producto y de la carga de
          trabajo de la pastelería en esas fechas.
        </p>
        <h3>4. Devoluciones</h3>
        <p>
          Dada la naturaleza perecedera de nuestros productos, no se
          aceptan devoluciones una vez confirmada la entrega salvo defecto
          de fabricación o error en el pedido.
        </p>
      </section>

      <section id="cookies" className="estatica__seccion">
        <h2>Política de cookies</h2>
        <p>
          Para el correcto funcionamiento del sitio: gestión de la sesión y
          preferencias de visualización. No se utilizan cookies de seguimiento
        </p>
        <p>
          El usuario puede en cualquier momento configurar su navegador
          para bloquear o eliminar las cookies almacenadas, si bien
          algunas funciones del sitio podrían dejar de funcionar
          correctamente.
        </p>
      </section>
    </article>
  )
}

export default Legal