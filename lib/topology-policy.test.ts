import { describe, expect, it } from "vitest"
import { selectTopologyPolicy } from "@/lib/topology-policy"

describe("selectTopologyPolicy", () => {
  it("uses the static experience for reduced motion", () => {
    expect(
      selectTopologyPolicy({
        reducedMotion: true,
        webgl2: true,
        coarsePointer: false,
        viewportWidth: 1440,
        devicePixelRatio: 2,
      }),
    ).toEqual({ mode: "static", dpr: 1, particleCount: 0 })
  })

  it("uses the static experience when WebGL2 is unavailable", () => {
    expect(
      selectTopologyPolicy({
        reducedMotion: false,
        webgl2: false,
        coarsePointer: false,
        viewportWidth: 1440,
        devicePixelRatio: 2,
      }).mode,
    ).toBe("static")
  })

  it("caps desktop DPR and particle count", () => {
    expect(
      selectTopologyPolicy({
        reducedMotion: false,
        webgl2: true,
        coarsePointer: false,
        viewportWidth: 1440,
        devicePixelRatio: 3,
      }),
    ).toEqual({ mode: "enhanced", dpr: 1.5, particleCount: 7000 })
  })

  it("uses the low quality policy for small or coarse-pointer devices", () => {
    expect(
      selectTopologyPolicy({
        reducedMotion: false,
        webgl2: true,
        coarsePointer: true,
        viewportWidth: 390,
        devicePixelRatio: 3,
      }),
    ).toEqual({ mode: "low", dpr: 1, particleCount: 4000 })
  })
})
