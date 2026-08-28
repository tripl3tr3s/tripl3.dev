import dynamic from "next/dynamic"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { topologyEdges, topologyNodes } from "@/lib/portfolio-data"
import { selectTopologyPolicy, type TopologyPolicy } from "@/lib/topology-policy"

const ParticleCore = dynamic(() => import("@/components/particle-core"), { ssr: false })

const staticPolicy: TopologyPolicy = { mode: "static", dpr: 1, particleCount: 0 }

function detectPolicy(): TopologyPolicy {
  const canvas = document.createElement("canvas")
  return selectTopologyPolicy({
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    viewportWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio || 1,
    webgl2: Boolean(canvas.getContext("webgl2")),
  })
}

export default function AgentTopology() {
  const [activeId, setActiveId] = useState(topologyNodes[0].id)
  const [policy, setPolicy] = useState<TopologyPolicy>(staticPolicy)
  const [canvasReady, setCanvasReady] = useState(false)
  const activeNode = topologyNodes.find((node) => node.id === activeId) ?? topologyNodes[0]
  const positions = useMemo(
    () => new Map(topologyNodes.map((node) => [node.id, node.position])),
    [],
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPolicy(detectPolicy())
    const frame = window.requestAnimationFrame(update)
    media.addEventListener("change", update)
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      media.removeEventListener("change", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const selectRelativeNode = (direction: number) => {
    const currentIndex = topologyNodes.findIndex((node) => node.id === activeId)
    const nextIndex = (currentIndex + direction + topologyNodes.length) % topologyNodes.length
    setActiveId(topologyNodes[nextIndex].id)
    document.getElementById(`topology-${topologyNodes[nextIndex].id}`)?.focus()
  }

  return (
    <div
      className="topology-shell relative min-h-[430px] overflow-hidden rounded-[1.75rem] border border-primary/20 bg-black/80 shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:min-h-[550px]"
      aria-label="Interactive agent system topology"
    >
      <div className="absolute inset-x-0 bottom-24 top-0">
        <div className="topology-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {topologyEdges.map((edge) => {
            const from = positions.get(edge.from)
            const to = positions.get(edge.to)
            if (!from || !to) return null
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="topology-line"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/dado_333_amarillo_sin fondo.webp"
            alt=""
            width={160}
            height={160}
            className={`h-full w-full object-contain transition-opacity duration-500 ${
              canvasReady ? "opacity-0" : "opacity-90"
            }`}
            priority
          />
        </div>

        {policy.mode !== "static" && (
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ${
              canvasReady ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ParticleCore
              count={policy.particleCount}
              maxDpr={policy.dpr}
              onLoad={() => setCanvasReady(true)}
              onError={() => setCanvasReady(false)}
            />
          </div>
        )}

        {topologyNodes.map((node) => (
          <button
            key={node.id}
            id={`topology-${node.id}`}
            type="button"
            aria-pressed={activeId === node.id}
            onClick={() => setActiveId(node.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault()
                selectRelativeNode(1)
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault()
                selectRelativeNode(-1)
              }
            }}
            className="topology-node absolute z-20 min-h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-left font-mono text-[10px] font-semibold tracking-tight sm:text-xs"
            style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
          >
            {node.label}
          </button>
        ))}
      </div>

      <div
        className="absolute bottom-3 left-3 right-3 z-30 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur-md"
        aria-live="polite"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {activeNode.category}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-300 sm:text-sm">
          {activeNode.description}
        </p>
      </div>
    </div>
  )
}
