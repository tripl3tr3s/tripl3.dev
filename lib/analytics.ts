// Umami event taxonomy and pure helpers. Event names stay in Spanish to match the dashboard.
// React components tag elements with data-evento / data-evento-* (never data-umami-event,
// which Umami's script.js auto-sends on click and would double count).

export type UmamiValor = string | number | boolean
export type UmamiData = Record<string, UmamiValor>

declare global {
  interface Window {
    umami?: {
      track: (
        eventOrPayload: string | ((payload: Record<string, unknown>) => Record<string, unknown>),
        eventData?: UmamiData,
      ) => void
      identify: (idOrData: string | UmamiData, data?: UmamiData) => void
    }
  }
}

export type EventoMap = {
  "pagina-cargada": {
    ruta: string
    fuente: string
    campana: string
    dispositivo: Dispositivo
    viewport: string
    pantalla: string
    dpr: number
    toques: number
    zona_horaria: string
    idioma: string
  }
  "caso-visto": { caso: string }
  "caso-enlace": { caso: string; destino: string }
  "cert-abierta": { cert: string; origen: "tarjeta" | "destacada" }
  "cert-verificada": { cert: string }
  "cert-descargada": { cert: string }
  "post-abierto": { slug: string; tipo: "interno" | "externo" }
  "cv-abierto": { origen: string }
  "contacto-iniciado": Record<string, never>
  "contacto-enviado": { resultado: "exito" | "error-validacion" | "error-red" }
  "contacto-canal": { canal: string; seccion: string }
  clic: { id: string; seccion: string; tipo: TipoClic; destino?: string }
  "sesion-resumen": UmamiData
}

export type NombreEvento = keyof EventoMap
export type TipoClic = "nav" | "cta" | "externo" | "descarga" | "boton"
export type Dispositivo = "movil" | "tablet" | "escritorio"

export const VENTANA_DEDUPE_MS = 800
const CLAVES_DEDUPE = ["id", "caso", "cert", "slug", "canal", "origen"] as const

export function claveDedupe(nombre: string, data?: UmamiData): string {
  const sujeto = CLAVES_DEDUPE.map((k) => data?.[k]).find((v) => v !== undefined)
  return sujeto === undefined ? nombre : `${nombre}:${String(sujeto)}`
}

// Returns a sender that drops repeats of the same event+subject inside the dedupe window.
export function crearEmisor(
  enviar: (nombre: string, data?: UmamiData, url?: string) => void,
  ahora: () => number = Date.now,
) {
  let ultimos: ReadonlyMap<string, number> = new Map()
  return (nombre: string, data?: UmamiData, url?: string): boolean => {
    const clave = claveDedupe(nombre, data)
    const t = ahora()
    const previo = ultimos.get(clave)
    if (previo !== undefined && t - previo < VENTANA_DEDUPE_MS) return false
    ultimos = new Map([...ultimos, [clave, t]])
    enviar(nombre, data, url)
    return true
  }
}

// With url, the event is attributed to that path instead of Umami's current URL (needed when a
// route-change summary is sent after Next has already pushed the new URL).
const emisor = crearEmisor((nombre, data, url) =>
  url
    ? window.umami?.track((payload) => ({ ...payload, url, name: nombre, data }))
    : window.umami?.track(nombre, data),
)

// Untyped entry point for attribute-driven clicks; prefer track() in code.
// Returns false when nothing was sent (Umami missing or deduped).
export function trackCrudo(nombre: string, data?: UmamiData, url?: string): boolean {
  if (typeof window === "undefined" || !window.umami) return false
  return emisor(nombre, limpiar(data), url)
}

export function track<N extends NombreEvento>(nombre: N, data: EventoMap[N], url?: string): boolean {
  return trackCrudo(nombre, data as UmamiData, url)
}

function limpiar(data?: UmamiData): UmamiData | undefined {
  if (!data) return undefined
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== ""))
}

export function clasificarFuente(referrer: string, params: URLSearchParams, hostPropio = ""): string {
  const utm = params.get("utm_source")?.trim().toLowerCase()
  if (utm) return utm
  if (!referrer) return "directo"
  let host: string
  try {
    host = new URL(referrer).hostname.toLowerCase()
  } catch {
    return "referencia-web"
  }
  if (hostPropio && host === hostPropio) return "interno"
  if (host.includes("linkedin") || host === "lnkd.in") return "linkedin"
  if (host.includes("github")) return "github"
  if (host.includes("twitter") || host === "x.com" || host === "t.co") return "twitter"
  if (/(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave)\./.test(host) || host.startsWith("search.")) return "busqueda"
  return "referencia-web"
}

// screen.width misreports iPads as desktops (iPadOS sends a Mac UA), so use touch + pointer + viewport.
export function detectarDispositivo(input: {
  maxTouchPoints: number
  pointerCoarse: boolean
  innerWidth: number
}): Dispositivo {
  const tactil = input.maxTouchPoints > 1 || input.pointerCoarse
  if (!tactil) return "escritorio"
  return input.innerWidth < 768 ? "movil" : "tablet"
}

const UA_BOT = /HeadlessChrome|bot|crawler|spider|preview|scanner|lighthouse|facebookexternalhit|slurp/i

export function sospechaBot(input: { webdriver: boolean; userAgent: string; interaccion: boolean }): boolean {
  return input.webdriver || UA_BOT.test(input.userAgent) || !input.interaccion
}

const CLAVE_CAMPANA = "analytics.campana"

// utm_campaign is kept per tab only (sessionStorage), never as a persistent visitor id.
export function leerCampana(search: string, almacen?: Pick<Storage, "getItem" | "setItem">): string {
  const desdeUrl = new URLSearchParams(search).get("utm_campaign")?.trim() ?? ""
  try {
    if (desdeUrl) {
      almacen?.setItem(CLAVE_CAMPANA, desdeUrl)
      return desdeUrl
    }
    return almacen?.getItem(CLAVE_CAMPANA) ?? ""
  } catch {
    return desdeUrl
  }
}

export function construirRecorrido(secciones: readonly string[], max = 400): string {
  const recorrido = secciones.join(">")
  return recorrido.length > max ? `${recorrido.slice(0, max - 3)}...` : recorrido
}

export function hostDe(href: string): string {
  try {
    return new URL(href, "https://tripl3.dev").hostname
  } catch {
    return ""
  }
}
