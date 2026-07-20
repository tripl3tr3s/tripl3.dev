"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: UmamiData) => void
      identify: (data: UmamiData) => void
    }
  }
}

type UmamiData = Record<string, string | number | boolean>

export function AnalyticsTracker() {
  const sectionTimers = useRef<Map<string, number>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const engagementStart = useRef<number>(Date.now())
  const lastActivity = useRef<number>(Date.now())
  const isActive = useRef<boolean>(true)
  const cleanups = useRef<Array<() => void>>([])

  useEffect(() => {
    const track = (name: string, data?: UmamiData) => window.umami?.track(name, data)

    const findSection = (el: Element): string => {
      const s = el.closest("section[id], main > div[id]")
      return s?.id || s?.getAttribute("data-section") || "global"
    }

    const trackEngagement = (motivo: string) => {
      if (!isActive.current) return
      const duracion = Math.round((Date.now() - engagementStart.current) / 1000)
      if (duracion > 0) track("tiempo-sesion", { duracion, motivo, ruta: window.location.pathname })
    }

    // Activity heartbeat
    const handleActivity = () => {
      lastActivity.current = Date.now()
      if (!isActive.current) {
        isActive.current = true
        engagementStart.current = Date.now()
      }
    }
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"] as const
    activityEvents.forEach(e => window.addEventListener(e, handleActivity, { passive: true }))
    cleanups.current.push(() => activityEvents.forEach(e => window.removeEventListener(e, handleActivity)))

    // Idle detection
    const idleTimer = setInterval(() => {
      if (Date.now() - lastActivity.current > 30_000 && isActive.current) {
        trackEngagement("sesion-inactiva")
        isActive.current = false
      }
    }, 10_000)
    cleanups.current.push(() => clearInterval(idleTimer))

    // Page unload
    const handleUnload = () => trackEngagement("pagina-cerrada")
    window.addEventListener("beforeunload", handleUnload)
    cleanups.current.push(() => window.removeEventListener("beforeunload", handleUnload))

    // Session identification + page load - fires once Umami is ready
    const umamiCheck = setInterval(() => {
      if (!window.umami) return
      clearInterval(umamiCheck)

      const referido = document.referrer
      const fuente = referido.includes("linkedin") ? "linkedin"
        : referido.includes("github") ? "github"
        : referido.includes("twitter") || referido.includes("x.com") ? "twitter"
        : referido.includes("google") || referido.includes("bing") || referido.includes("duckduckgo") ? "busqueda"
        : referido ? "referencia-web"
        : "directo"

      const dispositivo = window.screen.width < 768 ? "movil"
        : window.screen.width < 1024 ? "tablet"
        : "escritorio"

      window.umami.identify({ fuente, dispositivo, idioma_navegador: navigator.language })

      track("pagina-cargada", {
        idioma: navigator.language,
        pantalla: `${window.screen.width}x${window.screen.height}`,
        referido: referido || "directo",
      })
    }, 100)
    cleanups.current.push(() => clearInterval(umamiCheck))

    // Scroll depth (milestones: 25 / 50 / 75 / 100)
    let maxScroll = 0
    const scrollMilestones = new Set<number>()
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight
      if (docHeight === 0) return
      const pct = Math.round(((window.scrollY + window.innerHeight) / docHeight) * 100)
      if (pct <= maxScroll) return
      maxScroll = pct
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !scrollMilestones.has(m)) {
          scrollMilestones.add(m)
          track("profundidad-scroll", { profundidad: m })
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    cleanups.current.push(() => window.removeEventListener("scroll", handleScroll))

    // Section view + dwell time
    const sections = document.querySelectorAll("section[id], main > div[id]")
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id || entry.target.getAttribute("data-section") || "desconocido"
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!sectionTimers.current.has(id)) {
              sectionTimers.current.set(id, Date.now())
              track("seccion-vista", { seccion: id })
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
            const start = sectionTimers.current.get(id)
            if (start) {
              const dwell = Math.round((Date.now() - start) / 1000)
              if (dwell > 2) track("tiempo-en-seccion", { seccion: id, duracion: dwell })
              sectionTimers.current.delete(id)
            }
          }
        }
      },
      { threshold: [0.1, 0.5] },
    )
    sections.forEach(s => observerRef.current?.observe(s))
    cleanups.current.push(() => observerRef.current?.disconnect())

    // Single unified click handler: data-umami-event → external links → generic buttons
    const handleClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("button, a, [data-umami-event]") as HTMLElement | null
      if (!el) return

      const seccion = findSection(el)

      const explicitEvent = el.getAttribute("data-umami-event")
      if (explicitEvent) {
        const data: UmamiData = { seccion, texto: el.innerText?.substring(0, 50) ?? "" }
        for (const attr of Array.from(el.attributes)) {
          if (attr.name.startsWith("data-umami-") && attr.name !== "data-umami-event") {
            data[attr.name.replace("data-umami-", "")] = attr.value
          }
        }
        track(explicitEvent, data)
        return
      }

      if (el.tagName === "A") {
        const a = el as HTMLAnchorElement
        if (a.hostname && a.hostname !== window.location.hostname) {
          track("enlace-externo", {
            destino: a.hostname,
            texto: a.textContent?.trim().substring(0, 50) ?? "",
            seccion,
          })
        }
        return
      }

      const isButton = el.tagName === "BUTTON" || el.getAttribute("role") === "button"
      if (isButton) {
        track("clic-boton", {
          boton: el.textContent?.trim().substring(0, 50) ?? "desconocido",
          id: el.id || "sin-id",
          seccion,
        })
      }
    }
    document.addEventListener("click", handleClick)
    cleanups.current.push(() => document.removeEventListener("click", handleClick))

    // Form submissions
    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement
      track("formulario-enviado", { formulario: form.id || form.name || "contacto" })
    }
    document.addEventListener("submit", handleSubmit)
    cleanups.current.push(() => document.removeEventListener("submit", handleSubmit))

    return () => {
      cleanups.current.forEach(fn => fn())
      cleanups.current = []
    }
  }, [])

  return null
}
