import './Estatica.css'

function Legal() {
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
          Las presentes condiciones regulan la compra de los productos
          ofrecidos en el sitio web de Paraíso Cupcake Shop.
        </p>
        <h3>2. Precios e impuestos</h3>
        <p>
          Todos los precios mostrados incluyen el IVA aplicable. Los
          gastos de envío se desglosan antes de finalizar la compra.
        </p>
        <h3>3. Plazos de entrega</h3>
        <p>
          El plazo de entrega habitual es de 3 dias. El cliente
          podrá elegir fecha y franja horaria de entrega en el proceso de
          facturación.
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
          Este sitio utiliza cookies técnicas estrictamente necesarias
          para el correcto funcionamiento de la tienda online: gestión de
          la sesión, persistencia del carrito y preferencias de
          visualización. No se utilizan cookies de seguimiento
          publicitario ni de terceros con fines de perfilado.
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