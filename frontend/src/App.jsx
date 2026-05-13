import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritosProvider } from './context/FavoritosContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header/Header'
import CartSidebar from './components/CartSidebar/CartSidebar' // NUEVO
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import Carrito from './pages/Carrito'
import Facturacion from './pages/Facturacion'
import Favoritos from './pages/Favoritos'
import DetalleProducto from './pages/DetalleProducto'
import Categoria from './pages/Categoria'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritosProvider>
          <BrowserRouter>
            <Header />
            <CartSidebar /> {/* NUEVO: drawer global, posicionado por CSS */}
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/facturacion" element={<Facturacion />} />
                <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
                <Route path="/productos/:slug" element={<DetalleProducto />} />
                <Route path="/categorias/:slug" element={<Categoria />} />
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