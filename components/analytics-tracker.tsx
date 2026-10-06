"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  type UmamiData,
  clasificarFuente,
  construirRecorrido,
  detectarDispositivo,
  hostDe,
  leerCampana,
  sospechaBot,
  track,
  trackCrudo,
} from "@/lib/analytics"

const INACTIVIDAD_MS = 30_000
const TICK_MS = 5_000
const CASO_VISTO_MS = 4_000
const ESPERA_UMAMI_MS = 10_000
const EVENTOS_ACTIVIDAD = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const

// Resolved on the first route of a page load; client-side navigations drop the UTM query and
// would otherwise overwrite the session source with "directo".
let fuenteSesion: string | null = null

function seccionDe(el: Element): string {
  const seccion = el.closest("section[id]")?.id
  if (seccion) return seccion
  return el.closest("header, nav, footer")?.tagName.toLowerCase() ?? "global"
}

// data-evento="clic" data-evento-tipo="cta" -> { tipo: "cta" }
function propiedadesEvento(el: HTMLElement): UmamiData {
  return Object.fromEntries(
    Object.entries(el.dataset)
      .filter(([k, v]) => k.startsWith("evento") && k !== "evento" && v !== undefined)
      .map(([k, v]) => [k.charAt(6).toLowerCase() + k.slice(7), v as string]),
  )
}

function textoCorto(el: HTMLElement): string {
  return (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50)
}

export function AnalyticsTracker() {
  const ruta = usePathname()

  useEffect(() => {
    const inicio = Date.now()
    const urlRuta = window.location.pathname + window.location.search
    // The iframe on /cv swallows all input, so the parent summary there would always look like a bot;
    // cv-lectura from public/cv/index.html covers that page instead.
    const conResumen = !/^\/cv(\/|$)/.test(ruta)
    let ultimaActividad = Number.NEGATIVE_INFINITY
    let actividadDesdeEnvio = false
    let interaccion = false
    let segundosActivos = 0
    let clics = 0
    let scrollMax = 0
    let envio = 0
    let orden: readonly string[] = []
    let dwell: ReadonlyMap<string, number> = new Map()
    let abiertas: ReadonlyMap<string, number> = new Map()
    let casosVistos: readonly string[] = []
    let timersCaso: ReadonlyMap<string, ReturnType<typeof setTimeout>> = new Map()
    const limpiezas: Array<() => void> = []
    const escuchar = (objetivo: EventTarget, evento: string, fn: EventListener, opciones?: AddEventListenerOptions) => {
      objetivo.addEventListener(evento, fn, opciones)
      limpiezas.push(() => objetivo.removeEventListener(evento, fn, opciones))
    }

    // Activity: drives active time, the human signal and whether a re-sent summary has news
    const marcarActividad = () => {
      ultimaActividad = Date.now()
      interaccion = true
      actividadDesdeEnvio = true
    }
    EVENTOS_ACTIVIDAD.forEach((e) => escuchar(window, e, marcarActividad, { passive: true }))

    const tick = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - ultimaActividad < INACTIVIDAD_MS) {
        segundosActivos += TICK_MS / 1000
      }
    }, TICK_MS)
    limpiezas.push(() => clearInterval(tick))

    const medirScroll = () => {
      const alto = document.documentElement.scrollHeight
      if (alto === 0) return
      scrollMax = Math.max(scrollMax, Math.min(100, Math.round(((window.scrollY + window.innerHeight) / alto) * 100)))
    }
    escuchar(window, "scroll", medirScroll, { passive: true })

    // Sections and case studies: "in view" means crossing the viewport center line, which works
    // for sections of any height (a ratio threshold never triggers on sections taller than 2 viewports).
    const cerrarSeccion = (id: string, ahora: number) => {
      const desde = abiertas.get(id)
      if (desde === undefined) return
      dwell = new Map([...dwell, [id, (dwell.get(id) ?? 0) + (ahora - desde)]])
      abiertas = new Map([...abiertas].filter(([k]) => k !== id))
    }
    const iniciarCaso = (caso: string) => {
      if (casosVistos.includes(caso) || timersCaso.has(caso) || document.visibilityState !== "visible") return
      const timer = setTimeout(() => {
        casosVistos = [...casosVistos, caso]
        timersCaso = new Map([...timersCaso].filter(([k]) => k !== caso))
        track("caso-visto", { caso })
      }, CASO_VISTO_MS)
      timersCaso = new Map([...timersCaso, [caso, timer]])
    }
    const cancelarCaso = (caso: string) => {
      clearTimeout(timersCaso.get(caso))
      timersCaso = new Map([...timersCaso].filter(([k]) => k !== caso))
    }
    const enLineaCentral = (el: Element) => {
      const { top, bottom } = el.getBoundingClientRect()
      const centro = window.innerHeight / 2
      return top <= centro && bottom >= centro
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        const ahora = Date.now()
        for (const entrada of entradas) {
          const el = entrada.target as HTMLElement
          const caso = el.dataset.caso
          if (caso) {
            if (entrada.isIntersecting) iniciarCaso(caso)
            else cancelarCaso(caso)
            continue
          }
          if (entrada.isIntersecting) {
            if (!orden.includes(el.id)) orden = [...orden, el.id]
            abiertas = new Map([...abiertas, [el.id, ahora]])
          } else {
            cerrarSeccion(el.id, ahora)
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    )
    document.querySelectorAll("section[id], article[data-caso]").forEach((el) => observador.observe(el))
    limpiezas.push(() => {
      observador.disconnect()
      timersCaso.forEach(clearTimeout)
    })

    // One summary per page view; re-sent (envio + 1) only if there was activity after the last send
    const enviarResumen = () => {
      if (!conResumen || (envio > 0 && !actividadDesdeEnvio)) return
      const ahora = Date.now()
      const totales = new Map(
        [...new Set([...dwell.keys(), ...abiertas.keys()])].map((id) => [
          id,
          (dwell.get(id) ?? 0) + (abiertas.has(id) ? ahora - (abiertas.get(id) ?? ahora) : 0),
        ]),
      )
      const enviado = track(
        "sesion-resumen",
        {
          ruta,
          envio: envio + 1,
          segundos_activos: segundosActivos,
          segundos_totales: Math.round((ahora - inicio) / 1000),
          clics,
          scroll_max: scrollMax,
          secciones: orden.length,
          recorrido: construirRecorrido(orden),
          casos_vistos: casosVistos.join(","),
          interaccion,
          sospecha_bot: sospechaBot({ webdriver: navigator.webdriver, userAgent: navigator.userAgent, interaccion }),
          ...Object.fromEntries([...totales].map(([id, ms]) => [`seg_${id}`, Math.round(ms / 1000)])),
        },
        urlRuta,
      )
      if (!enviado) return
      envio += 1
      actividadDesdeEnvio = false
    }

    // Dwell and case timers only run while the tab is visible. On return, reopen whatever is on the
    // center line now, since observer entries fired while hidden are not trusted.
    escuchar(document, "visibilitychange", () => {
      const ahora = Date.now()
      if (document.visibilityState === "hidden") {
        enviarResumen()
        for (const id of [...abiertas.keys()]) cerrarSeccion(id, ahora)
        for (const caso of [...timersCaso.keys()]) cancelarCaso(caso)
        return
      }
      observador.takeRecords()
      document.querySelectorAll<HTMLElement>("section[id], article[data-caso]").forEach((el) => {
        if (!enLineaCentral(el)) return
        if (el.dataset.caso) iniciarCaso(el.dataset.caso)
        else abiertas = new Map([...abiertas, [el.id, ahora]])
      })
    })
    escuchar(window, "pagehide", () => enviarResumen())

    // Page load context, once Umami is ready
    let esperado = 0
    const esperaUmami = setInterval(() => {
      esperado += 100
      if (esperado > ESPERA_UMAMI_MS) return clearInterval(esperaUmami)
      if (!window.umami) return
      clearInterval(esperaUmami)

      let almacen: Storage | undefined
      try {
        almacen = window.sessionStorage
      } catch {
        almacen = undefined
      }
      const campana = leerCampana(window.location.search, almacen)
      const primeraRuta = fuenteSesion === null
      fuenteSesion ??= clasificarFuente(document.referrer, new URLSearchParams(window.location.search), window.location.hostname)
      const fuente = fuenteSesion
      const dispositivo = detectarDispositivo({
        maxTouchPoints: navigator.maxTouchPoints,
        pointerCoarse: window.matchMedia("(pointer: coarse)").matches,
        innerWidth: window.innerWidth,
      })
      const zona_horaria = Intl.DateTimeFormat().resolvedOptions().timeZone
      const sesion = { fuente, dispositivo, zona_horaria, idioma_navegador: navigator.language }
      if (primeraRuta) {
        if (campana) window.umami.identify(campana, { ...sesion, campana })
        else window.umami.identify(sesion)
      }

      track("pagina-cargada", {
        ruta,
        fuente,
        campana,
        dispositivo,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        pantalla: `${window.screen.width}x${window.screen.height}`,
        dpr: window.devicePixelRatio,
        toques: navigator.maxTouchPoints,
        zona_horaria,
        idioma: navigator.language,
      })
    }, 100)
    limpiezas.push(() => clearInterval(esperaUmami))

    // Clicks: explicit data-evento first, then typed fallbacks. data-sin-rastreo marks elements
    // whose event is sent from component code.
    const alClic = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-evento], a, button, [role='button']")
      if (!el) return
      clics += 1
      if (el.closest("[data-sin-rastreo]")) return
      const seccion = seccionDe(el)

      const nombre = el.dataset.evento
      if (nombre) {
        trackCrudo(nombre, { seccion, ...propiedadesEvento(el) })
        return
      }

      if (el instanceof HTMLAnchorElement) {
        const href = el.getAttribute("href") ?? ""
        const destino = hostDe(el.href)
        if (/^\/cv(\/|$|\?)/.test(href)) {
          track("cv-abierto", { origen: seccion })
        } else if (el.hasAttribute("download") || /\.pdf($|\?)/i.test(href)) {
          track("clic", { id: href.split("/").pop() ?? href, seccion, tipo: "descarga" })
        } else if (destino && destino !== window.location.hostname) {
          track("clic", { id: textoCorto(el) || destino, seccion, tipo: "externo", destino })
        } else {
          track("clic", { id: href, seccion, tipo: "nav" })
        }
        return
      }

      track("clic", { id: el.id || textoCorto(el) || "sin-id", seccion, tipo: "boton" })
    }
    escuchar(document, "click", alClic as EventListener)

    return () => {
      enviarResumen()
      limpiezas.forEach((fn) => fn())
    }
  }, [ruta])

  return null
}
