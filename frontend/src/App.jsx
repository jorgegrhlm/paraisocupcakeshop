import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import Carrito from './pages/Carrito'
import Favoritos from './pages/Favoritos'
import DetalleProducto from './pages/DetalleProducto'
import Categoria from './pages/Categoria'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/productos/:slug" element={<DetalleProducto />} />
          <Route path="/categorias/:slug" element={<Categoria />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App