export interface RectCache {
  readonly current: DOMRect
  readonly destroy: () => void
}

export function createRectCache(element: HTMLElement): RectCache {
  let current = element.getBoundingClientRect()

  const update = () => {
    current = element.getBoundingClientRect()
  }

  window.addEventListener("resize", update, { passive: true })
  window.addEventListener("scroll", update, { passive: true, capture: true })

  return {
    get current() {
      return current
    },
    destroy() {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    },
  }
}
