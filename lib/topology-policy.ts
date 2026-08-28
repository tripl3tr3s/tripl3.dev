export interface TopologyCapabilities {
  readonly reducedMotion: boolean
  readonly webgl2: boolean
  readonly coarsePointer: boolean
  readonly viewportWidth: number
  readonly devicePixelRatio: number
}

export interface TopologyPolicy {
  readonly mode: "static" | "low" | "enhanced"
  readonly dpr: number
  readonly particleCount: number
}

export function selectTopologyPolicy(capabilities: TopologyCapabilities): TopologyPolicy {
  if (capabilities.reducedMotion || !capabilities.webgl2) {
    return { mode: "static", dpr: 1, particleCount: 0 }
  }

  if (capabilities.coarsePointer || capabilities.viewportWidth < 768) {
    return { mode: "low", dpr: 1, particleCount: 4000 }
  }

  return {
    mode: "enhanced",
    dpr: Math.min(Math.max(capabilities.devicePixelRatio, 1), 1.5),
    particleCount: 7000,
  }
}
