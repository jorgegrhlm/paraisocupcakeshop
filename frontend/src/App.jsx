import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritosProvider } from './context/FavoritosContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import Header from './components/Header/Header'
import CartSidebar from './components/CartSidebar/CartSidebar' // NUEVO
import Footer from './components/Footer/Footer'
import Banner from './components/Banner/Banner'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import Carrito from './pages/Carrito'
import Facturacion from './pages/Facturacion'
import ConfirmacionPedido from './pages/ConfirmacionPedido'
import Favoritos from './pages/Favoritos'
import DetalleProducto from './pages/DetalleProducto'
import Categoria from './pages/Categoria'
import Legal from './pages/Legal'
import Contacto from './pages/Contacto'
import Faqs from './pages/Faqs'
import { MOSTRAR_PRECIOS } from './config/tienda'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritosProvider>
          <BrowserRouter>
            <Header />
            {/* Drawer global del carrito: solo en modo tienda. */}
            {MOSTRAR_PRECIOS && <CartSidebar />}
            <Banner />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path="/registro" element={<PublicOnlyRoute><Registro /></PublicOnlyRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                {/* Rutas de compra. En modo catalogo no se eliminan: se
                    sustituyen por una redireccion al inicio, para que un
                    enlace antiguo o un marcador no acabe en pagina en blanco. */}
                {MOSTRAR_PRECIOS ? (
                  <>
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/facturacion" element={<Facturacion />} />
                    <Route path="/confirmacion-pedido" element={<ConfirmacionPedido />} />
                  </>
                ) : (
                  <>
                    <Route path="/carrito" element={<Navigate to="/" replace />} />
                    <Route path="/facturacion" element={<Navigate to="/" replace />} />
                    <Route path="/confirmacion-pedido" element={<Navigate to="/" replace />} />
                  </>
                )}
                <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
                <Route path="/productos/:slug" element={<DetalleProducto />} />
                <Route path="/categorias/:slug" element={<Categoria />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/faqs" element={<Faqs />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </FavoritosProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App