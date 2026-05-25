import Carrusel from '../components/Carrusel/Carrusel'
import ProductoCard from '../components/ProductoCard/ProductoCard'
import InfoTienda from '../components/InfoTienda/InfoTienda'
import useProductosDestacados from '../hooks/useProductosDestacados'
import './Home.css'

function Home() {
  const { data: productos, loading, error } = useProductosDestacados()

  return (
    <div className="home">

      <section className="home__destacados">
        <h2 className="home__seccion-titulo">Productos Destacados</h2>

        {loading && <p className="home__estado">Cargando productos...</p>}

        {error && (
          <p className="home__estado home__estado--error">
            Error al cargar productos: {error.message}
          </p>
        )}

        {productos && productos.length > 0 && (
          <Carrusel itemsVisible={4}>
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                variant="home"
              />
            ))}
          </Carrusel>
        )}

        {productos && productos.length === 0 && (
          <p className="home__estado">No hay productos destacados disponibles.</p>
        )}
      </section>

      <section className="home__descripcion">
        <InfoTienda /> 
      </section>
    </div>
  )
}

export default Home