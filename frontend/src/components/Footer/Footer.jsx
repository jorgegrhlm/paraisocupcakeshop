import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Header/Icon'
import './Footer.css'

function Footer() {
  const [exploraOpen, setExploraOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(false)

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__column">
          <button
            type="button"
            className="footer__column-btn nav-text"
            onClick={() => setExploraOpen(!exploraOpen)}
            aria-expanded={exploraOpen}
          >
            EXPLORA
            <Icon
              name="chevron-down"
              size={16}
              className={exploraOpen ? 'footer__chevron--open' : ''}
            />
          </button>
          {exploraOpen && (
            <ul className="footer__dropdown">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/favoritos">Favoritos</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
              <li><Link to="/perfil">Mi cuenta</Link></li>
            </ul>
          )}
        </div>

        <div className="footer__column footer__column--right">
          <button
            type="button"
            className="footer__column-btn nav-text"
            onClick={() => setLegalOpen(!legalOpen)}
            aria-expanded={legalOpen}
          >
            LEGAL
            <Icon
              name="chevron-down"
              size={16}
              className={legalOpen ? 'footer__chevron--open' : ''}
            />
          </button>
          {legalOpen && (
            <ul className="footer__dropdown">
              <li><a href="#">Aviso legal</a></li>
              <li><a href="#">Política de privacidad</a></li>
              <li><a href="#">Términos y condiciones</a></li>
              <li><a href="#">Política de cookies</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className="footer__copyright caption">
        © Copyright 2019 - 2026 | Paraíso Cupcake Shop | Todos los derechos reservados
      </div>
    </footer>
  )
}

export default Footer