import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CONTACTO } from '../config/tienda'
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
        Esta página recoge la información legal y las condiciones de uso del
        sitio web de Paraíso Cupcake Shop.
      </p>

            <section id="aviso-legal" className="estatica__seccion">
        <h2>Aviso legal</h2>
        <p>Datos del titular de este sitio web:</p>
        <ul>
          <li><strong>Denominación:</strong> Paraíso Cupcake Shop</li>
          <li><strong>RIF:</strong> J-40836218-0</li>
          <li><strong>Domicilio:</strong> Calle San Juan N.º 17, 2103 Maracay (Venezuela)</li>
          <li><strong>Correo electrónico:</strong> {CONTACTO.email}</li>
          <li><strong>WhatsApp:</strong> {CONTACTO.whatsapp}</li>
        </ul>
        <p>
          El acceso a este sitio implica la aceptación de las condiciones
          recogidas en esta página. Paraíso Cupcake Shop se reserva el derecho
          a modificar el contenido del sitio sin previo aviso.
        </p>
        <p>
          Los textos, las fotografías de los productos y el resto de contenidos
          son propiedad de Paraíso Cupcake Shop y no pueden reproducirse sin
          autorización.
        </p>
      </section>
      <section id="privacidad" className="estatica__seccion">
        <h2>Política de privacidad</h2>
        <p>
          Paraíso Cupcake Shop es una pastelería artesanal situada en Maracay,
          Venezuela, y es la responsable de los datos que se recogen en este
          sitio web.
        </p>

        <h3>Qué datos se recogen y para qué</h3>
        <ul>
          <li>
            <strong>Registro de usuario:</strong> nombre de usuario y correo
            electrónico, para crear y mantener la cuenta y guardar los
            productos marcados como favoritos. La contraseña se almacena
            cifrada y nadie de la tienda puede consultarla.
          </li>
          <li>
            <strong>Consultas de precio:</strong> los datos que el cliente
            facilite al escribir por WhatsApp o por correo, con la única
            finalidad de responder y preparar el presupuesto pedido.
          </li>
        </ul>

        <h3>Qué no se hace</h3>
        <ul>
          <li>
            Este sitio no vende en línea ni procesa pagos: no se piden ni se
            almacenan datos bancarios ni de tarjetas.
          </li>
          <li>
            Los datos no se ceden a terceros con fines comerciales ni se usan
            para enviar publicidad.
          </li>
        </ul>

        <h3>Cookies y analítica</h3>
        <p>
          El sitio usa cookies técnicas necesarias para mantener la sesión
          iniciada. No se emplean cookies publicitarias ni de seguimiento.
        </p>
        <p>
          Para saber cuánta gente visita la web se utiliza Cloudflare Web
          Analytics, que mide las visitas de forma agregada y anónima, sin
          cookies y sin identificar a ninguna persona concreta. Registra datos
          como el país, la página visitada y el tipo de dispositivo.
        </p>

        <h3>Conservación y derechos</h3>
        <p>
          Las cuentas se conservan mientras el usuario las mantenga abiertas.
          Cualquier persona puede pedir el acceso, la rectificación o la
          eliminación de sus datos, así como la baja de su cuenta, escribiendo
          a <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>. Las
          solicitudes se atienden en el menor plazo posible.
        </p>
        <p>
          La tienda opera desde Venezuela. Si la solicitud viene de una persona
          residente en la Unión Europea, se atenderán igualmente los derechos
          reconocidos por el Reglamento (UE) 2016/679.
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