import { useEffect, useState } from 'react'

/**
 * Devuelve true cuando la pagina se ha desplazado mas de `umbral` pixeles.
 * Lo usan la cabecera (para encogerse) y la barra de categorias (para
 * aparecer), de modo que las dos reaccionan exactamente a la vez.
 */
export default function useScrolled(umbral = 180) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const alHacerScroll = () => setScrolled(window.scrollY > umbral)
    // Una primera comprobacion por si la pagina ya viene desplazada.
    alHacerScroll()
    // passive: true evita que el navegador espere a este codigo para desplazar.
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => window.removeEventListener('scroll', alHacerScroll)
  }, [umbral])

  return scrolled
}