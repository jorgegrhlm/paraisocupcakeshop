import { Link } from 'react-router-dom'
import Icon from './Icon'
import CategoriasMenu from '../CategoriasMenu/CategoriasMenu'
import UserMenu from '../UserMenu/UserMenu'
import useCart from '../../hooks/useCart'
import useFavoritos from '../../hooks/useFavoritos'
import logo from '../../assets/logo-paraiso.svg'
import './Header.css'

function Header() {
  const { count: cartCount, toggleCart } = useCart() // CAMBIO: añadido toggleCart
  const { count: favoritosCount } = useFavoritos()

  return (
    <header className="header">
      <div className="header__left">
        <CategoriasMenu buttonClassName="header__categorias-btn nav-text" />
      </div>

      <Link to="/" className="header__logo" aria-label="Ir a inicio">
        <img src={logo} alt="" className="header__logo-img" />
        <span className="header__logo-text logo">Paraíso Cupcacke Shop</span>
        <img src={logo} alt="" className="header__logo-img" />
      </Link>

      <div className="header__right">
        <UserMenu />

        <Link
          to="/favoritos"
          className="header__icon-btn"
          aria-label="Favoritos"
        >
          <Icon name="heart" />
          {favoritosCount > 0 && (
            <span className="header__cart-badge">{favoritosCount}</span>
          )}
        </Link>

        {/* CAMBIO: ahora es <button> que abre el sidebar, no <Link> */}
        <button
          type="button"
          onClick={toggleCart}
          className="header__icon-btn header__cart-btn"
          aria-label="Abrir carrito"
        >
          <Icon name="cart" />
          {cartCount > 0 && (
            <span className="header__cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}

export default Header