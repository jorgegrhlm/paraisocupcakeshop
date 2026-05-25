import './InfoTienda.css'

function InfoTienda() {
  return (
    <div className="info-tienda">

      <section className="info-tienda__hero">
        <h1 className="info-tienda__hero-titulo">
          🎉Te acompañamos en todas tus celebraciones.🎉
        </h1>
        <p className="info-tienda__hero-subtitulo">
          Tortas, cupcakes y postres artesanales elaborados por encargo. Cada pieza, única.
        </p>
      </section>

      <section className="info-tienda__historia">
        <h2 className="info-tienda__seccion-titulo">Nuestra historia</h2>
        <p>
          Todo comenzó en casa, con una idea sencilla:
        </p>
           
        <p>

            "que mis hijos siempre tuvieran una torta en sus cumpleaños, hecha con amor".
        
        </p>
        
        <p>
          Magglis empezó elaborando sus propias tortas para sus hijos, pero
          pronto familiares, amigos y conocidos comenzaron a pedirle las suyas. La respuesta siempre
          era la misma "deberías vender esto." Con el tiempo, Magglis decidió formarse,
          perfeccionar sus técnicas y convertir esa pasión en un proyecto real.
        </p>
        <p>
          Así nació Paraíso Cupcake Shop: una pastelería artesanal de pedidos
          personalizados donde cada dulce se elabora con los mismos cuidados de siempre,
          solo que ahora para mucha más gente.
        </p>
      </section>

      <section className="info-tienda__especialidades">
        <h2 className="info-tienda__seccion-titulo">Nuestras especialidades</h2>
        <p>
          Trabajamos por encargo para que tu pedido llegue exactamente como lo imaginaste.
        </p>
        <ul className="info-tienda__lista">
          <li>Tortas de cumpleaños básicas y personalizadas</li>
          <li>Cupcakes para cualquier ocasión</li>
          <li>Postres variados: galletas, trufas y más</li>
          <li>Pedidos especiales adaptados a tus necesidades</li>
        </ul>
      </section>

    </div>
  )
}

export default InfoTienda