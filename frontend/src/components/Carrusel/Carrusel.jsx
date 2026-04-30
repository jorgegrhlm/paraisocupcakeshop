import { useState, useRef, Children } from 'react'
import Icon from '../Header/Icon'
import './Carrusel.css'

function Carrusel({ children, itemsVisible = 4 }) {
  const trackRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)

  const totalItems = Children.count(children)
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsVisible))

  const scrollToPage = (page) => {
    if (!trackRef.current) return
    const track = trackRef.current
    const scrollLeft = (track.scrollWidth / totalPages) * page
    track.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    setCurrentPage(page)
  }

  const handlePrev = () => scrollToPage(Math.max(0, currentPage - 1))
  const handleNext = () => scrollToPage(Math.min(totalPages - 1, currentPage + 1))

  const isFirst = currentPage === 0
  const isLast = currentPage >= totalPages - 1

  return (
    <div className="carrusel">
      <button
        type="button"
        className="carrusel__arrow carrusel__arrow--left"
        onClick={handlePrev}
        disabled={isFirst}
        aria-label="Productos anteriores"
      >
        <Icon name="arrow-left" />
      </button>

      <div ref={trackRef} className="carrusel__track">
        {children}
      </div>

      <button
        type="button"
        className="carrusel__arrow carrusel__arrow--right"
        onClick={handleNext}
        disabled={isLast}
        aria-label="Siguientes productos"
      >
        <Icon name="arrow-right" />
      </button>

      {totalPages > 1 && (
        <div className="carrusel__dots" role="tablist">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentPage}
              aria-label={`Ir a página ${i + 1}`}
              className={`carrusel__dot ${i === currentPage ? 'carrusel__dot--active' : ''}`}
              onClick={() => scrollToPage(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carrusel