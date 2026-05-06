import { Link } from 'react-router-dom'
import Icon from './Icon'
import CategoriasMenu from '../CategoriasMenu/CategoriasMenu'
import useCart from '../../hooks/useCart'
import logo from '../../assets/logo-paraiso.svg'
import './Header.css'

function Header() {
  const { count } = useCart()

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
        <Link
          to="/favoritos"
          className="header__icon-btn"
          aria-label="Favoritos"
        >
          <Icon name="heart" />
        </Link>
        <Link
          to="/carrito"
          className="header__icon-btn header__cart-btn"
          aria-label="Carrito"
        >
          <Icon name="cart" />
          {count > 0 && (
            <span className="header__cart-badge">{count}</span>
          )}
        </Link>
      </div>
    </header>
  )
}

export default Header