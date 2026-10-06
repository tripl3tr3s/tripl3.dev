import { describe, expect, it, vi } from "vitest"
import {
  VENTANA_DEDUPE_MS,
  claveDedupe,
  clasificarFuente,
  construirRecorrido,
  crearEmisor,
  detectarDispositivo,
  leerCampana,
  sospechaBot,
} from "@/lib/analytics"

describe("clasificarFuente", () => {
  it("prefers utm_source over the referrer", () => {
    expect(clasificarFuente("https://www.google.com/", new URLSearchParams("utm_source=CV-PDF"))).toBe("cv-pdf")
  })

  it.each([
    ["", "directo"],
    ["https://www.linkedin.com/feed/", "linkedin"],
    ["https://lnkd.in/abc", "linkedin"],
    ["https://github.com/tripl3tr3s", "github"],
    ["https://t.co/xyz", "twitter"],
    ["https://www.google.com.mx/", "busqueda"],
    ["https://duckduckgo.com/", "busqueda"],
    ["https://news.ycombinator.com/", "referencia-web"],
    ["not a url", "referencia-web"],
  ])("classifies %s as %s", (referrer, esperado) => {
    expect(clasificarFuente(referrer, new URLSearchParams())).toBe(esperado)
  })

  it("marks same-host referrers as internal", () => {
    expect(clasificarFuente("https://tripl3.dev/writing", new URLSearchParams(), "tripl3.dev")).toBe("interno")
  })
})

describe("detectarDispositivo", () => {
  it("treats an iPad reporting a desktop UA as a tablet", () => {
    expect(detectarDispositivo({ maxTouchPoints: 5, pointerCoarse: true, innerWidth: 1024 })).toBe("tablet")
  })

  it("detects phones by touch and narrow viewport", () => {
    expect(detectarDispositivo({ maxTouchPoints: 5, pointerCoarse: true, innerWidth: 390 })).toBe("movil")
  })

  it("keeps narrow desktop windows as desktop", () => {
    expect(detectarDispositivo({ maxTouchPoints: 0, pointerCoarse: false, innerWidth: 500 })).toBe("escritorio")
  })
})

describe("sospechaBot", () => {
  const humano = { webdriver: false, userAgent: "Mozilla/5.0 (iPhone)", interaccion: true }

  it("does not flag an interacting phone user", () => {
    expect(sospechaBot(humano)).toBe(false)
  })

  it.each([
    { ...humano, webdriver: true },
    { ...humano, userAgent: "Mozilla/5.0 HeadlessChrome/120" },
    { ...humano, interaccion: false },
  ])("flags automated or passive visits", (input) => {
    expect(sospechaBot(input)).toBe(true)
  })
})

describe("crearEmisor", () => {
  it("drops the same event and subject inside the dedupe window", () => {
    let t = 1_000
    const enviar = vi.fn()
    const emitir = crearEmisor(enviar, () => t)

    expect(emitir("clic", { id: "hero-cv" })).toBe(true)
    expect(emitir("clic", { id: "hero-cv" })).toBe(false)
    expect(emitir("clic", { id: "nav-work" })).toBe(true)
    t += VENTANA_DEDUPE_MS
    expect(emitir("clic", { id: "hero-cv" })).toBe(true)
    expect(enviar).toHaveBeenCalledTimes(3)
  })

  it("builds keys from the first subject property", () => {
    expect(claveDedupe("caso-visto", { caso: "sat-mcp" })).toBe("caso-visto:sat-mcp")
    expect(claveDedupe("contacto-iniciado")).toBe("contacto-iniciado")
  })
})

describe("leerCampana", () => {
  const crearAlmacen = () => {
    const datos = new Map<string, string>()
    return { getItem: (k: string) => datos.get(k) ?? null, setItem: (k: string, v: string) => void datos.set(k, v) }
  }

  it("stores the campaign from the URL and reuses it on later routes", () => {
    const almacen = crearAlmacen()
    expect(leerCampana("?utm_campaign=empresa-x-oct", almacen)).toBe("empresa-x-oct")
    expect(leerCampana("", almacen)).toBe("empresa-x-oct")
  })

  it("returns empty without a campaign or storage", () => {
    expect(leerCampana("")).toBe("")
  })

  it("survives a throwing storage", () => {
    const roto = { getItem: () => { throw new Error("blocked") }, setItem: () => { throw new Error("blocked") } }
    expect(leerCampana("?utm_campaign=x", roto)).toBe("x")
    expect(leerCampana("", roto)).toBe("")
  })
})

describe("construirRecorrido", () => {
  it("joins sections in first-view order", () => {
    expect(construirRecorrido(["hero", "work", "certifications"])).toBe("hero>work>certifications")
  })

  it("truncates long paths", () => {
    expect(construirRecorrido(["a".repeat(50), "b".repeat(50)], 20)).toHaveLength(20)
  })
})
