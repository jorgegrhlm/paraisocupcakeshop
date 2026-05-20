import './Estatica.css'

function Contacto() {
  return (
    <article className="estatica">
      <h1 className="estatica__titulo">Contáctanos</h1>
      <p className="estatica__intro">
        Estamos encantados de atenderte. Elige el canal que prefieras y
        te respondemos lo antes posible.
      </p>

      <section className="estatica__seccion">
        <div className="estatica__contacto-grid">
          <div className="estatica__contacto-card">
            <strong>Correo electrónico</strong>
            <a href="mailto:magglisramirez1@gmail.com">
              magglisramirez1@gmail.com
            </a>
          </div>

          <div className="estatica__contacto-card">
            <strong>Teléfono</strong>
            <a href="tel:+584127825317">+58 412 782 53 17</a>
          </div>

          <div className="estatica__contacto-card">
            <strong>Dirección</strong>
            Calle San Juan Nro 17<br />
            2103 Maracay (Venezuela)
          </div>

          <div className="estatica__contacto-card">
            <strong>Horario</strong>
            Lunes a sábado<br />
            10:00 — 20:00
          </div>
        </div>
      </section>

      <section className="estatica__seccion">
        <h2>Síguenos en redes</h2>
        <p>
          Comparte con nosotros tus creaciones favoritas y entérate de
          novedades en nuestras redes sociales:
        </p>
        <ul>
          <li>
            Instagram:{' '}
            <a 
              href="https://instagram.com/paraisocupcakeshop"
              target="_blank"
              rel="noopener noreferrer"
            >
              @paraisocupcakeshop
            </a>
          </li>
        </ul>
      </section>
    </article>
  )
}

export default Contacto