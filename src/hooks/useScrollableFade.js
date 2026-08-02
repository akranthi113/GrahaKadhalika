import { useEffect } from 'react'

export function useScrollableFade(containerRef, deps = []) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let raf = 0

    const update = () => {
      el.classList.toggle('has-scroll', el.scrollWidth > el.clientWidth + 1)
      el.classList.toggle('scrolled-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
      el.classList.toggle(
        'scrolled-start',
        el.scrollLeft <= 1
      )
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    el.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}