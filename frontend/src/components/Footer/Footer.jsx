import { Link } from 'react-router-dom'
import './Footer.css'

/**
 * Pie de página global. Una sola fila de enlaces horizontal hacia las
 * páginas estáticas (contacto, FAQs y los 4 apartados legales,
 * apuntando a anclas dentro de /legal) + copyright centrado.
 */
function Footer() {
  return (
    <footer className="footer">
      <nav className="footer__links" aria-label="Enlaces de pie de página">
        <Link to="/contacto" className="footer__link">Contáctanos</Link>
        <Link to="/faqs" className="footer__link">FAQs</Link>
        <Link to="/legal#aviso-legal" className="footer__link">Aviso legal</Link>
        <Link to="/legal#privacidad" className="footer__link">Política de privacidad</Link>
        <Link to="/legal#terminos" className="footer__link">Términos y condiciones</Link>
        <Link to="/legal#cookies" className="footer__link">Política de cookies</Link>
      </nav>
      <div className="footer__copyright caption">
        © Copyright 2019 - 2026 | Paraíso Cupcake Shop | Todos los derechos reservados
      </div>
    </footer>
  )
}

export default Footer