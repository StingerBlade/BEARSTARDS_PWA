import { useEffect, useRef, useState } from 'react'

// Aparece al entrar en pantalla. `r` es la inclinación final y `delay` el retraso en ms.
export default function Reveal({ as: Tag = 'div', r = 0, delay = 0, className = '', children, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-in' : ''} ${className}`}
      style={{ '--r': `${r}deg`, transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  )
}