function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <p className="logo" style={{ color: 'var(--color-primario)' }}>Paraíso Cupcake Shop</p>
      <p className="tagline" style={{ color: 'var(--color-acento-chocolate)' }}>Tortas y Dulces para toda ocasión</p>
      <h1>Bienvenido a Home</h1>
      <h2>Subtítulo de prueba</h2>
      <h3>Otro nivel de título</h3>
      <p className="body">Este es un párrafo en estilo Body.</p>
      <p className="body-strong">Este es un párrafo en Body Strong.</p>
      <p className="caption">Este es un caption pequeño.</p>
      <button className="btn-text" style={{ background: 'var(--color-primario)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radio-pill)' }}>
        Botón de prueba
      </button>
      <br /><br />
      <a className="link" href="#">Esto es un enlace</a>
    </div>
  )
}

export default Home