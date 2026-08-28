"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, CheckCircle2, Clock3, LockKeyhole, Pause, Play } from "lucide-react"
import {
  caseStudies,
  evidenceMetrics,
  openSourceProjects,
  type EvidenceStatus,
  type ProjectEvidence,
} from "@/lib/portfolio-data"

const statusConfig: Record<EvidenceStatus, { label: string; Icon: typeof CheckCircle2; className: string }> = {
  verified: { label: "Public proof", Icon: CheckCircle2, className: "text-emerald-700 dark:text-emerald-400" },
  private: { label: "Private system", Icon: LockKeyhole, className: "text-amber-700 dark:text-amber-300" },
  pending: { label: "Baseline pending", Icon: Clock3, className: "text-cyan-700 dark:text-cyan-300" },
}

function Status({ status }: { readonly status: EvidenceStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${config.className}`}>
      <config.Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </span>
  )
}

function EvidenceCard({ metric, index }: { readonly metric: ProjectEvidence; readonly index: number }) {
  const cardRef = useRef<HTMLElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const config = statusConfig[metric.status]

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reducedMotion) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return

    const px = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const py = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: py * -5, y: px * 5 })

    if (spotRef.current) {
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      spotRef.current.style.background = `radial-gradient(180px circle at ${x}% ${y}%, hsl(var(--primary) / 0.16), transparent 70%)`
      spotRef.current.style.opacity = "1"
    }
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    if (spotRef.current) spotRef.current.style.opacity = "0"
  }

  return (
    <motion.div
      className="h-full"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <motion.article
        ref={cardRef}
        aria-label={`${metric.label}: ${metric.value}`}
        animate={{ rotateX: reducedMotion ? 0 : tilt.x, rotateY: reducedMotion ? 0 : tilt.y }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        whileHover={reducedMotion ? undefined : { y: -6, scale: 1.01 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="tilt-card glass-card group relative h-full cursor-default overflow-hidden rounded-2xl border border-border p-5 transition-colors duration-300 hover:border-primary/45 focus-within:border-primary/60"
        style={{ transformPerspective: 800 }}
      >
        <div
          ref={spotRef}
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-300"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="mb-5 flex items-start justify-between gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/70 text-primary transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10">
              <config.Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${config.className}`}>
              {config.label}
            </span>
          </div>
          <p className="font-mono text-2xl font-black tracking-tight">{metric.value}</p>
          <p className="mt-1 text-sm font-semibold">{metric.label}</p>
          {metric.status === "verified" ? (
            <a href={metric.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-umami-event="evidence-open-source">
              Verify on GitHub
            </a>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">{metric.note}</p>
          )}
        </div>
      </motion.article>
    </motion.div>
  )
}

function CaseStudyVideo({ src, poster, title }: { readonly src: string; readonly poster: string; readonly title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => setShouldLoad(true), 0)
      return () => globalThis.clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting) setShouldLoad(true)
      },
      { rootMargin: "240px 0px" },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (shouldLoad && isVisible && !reducedMotion) {
      void video.play().catch(() => undefined)
      return
    }

    if (!video.paused) video.pause()
  }, [isVisible, reducedMotion, shouldLoad])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      setShouldLoad(true)
      void video.play().catch(() => undefined)
      return
    }
    video.pause()
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        aria-label={`${title} CLI demonstration`}
        src={shouldLoad ? src : undefined}
        poster={poster}
        preload={shouldLoad ? "metadata" : "none"}
        muted
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="h-full w-full object-cover object-left"
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={`${isPlaying ? "Pause" : "Play"} ${title} demonstration`}
        className="absolute bottom-4 right-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  )
}

export default function Research() {
  return (
    <section id="work" className="relative border-y border-border/70 bg-card/20 pb-20 pt-6 sm:pb-28 sm:pt-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-5 border-b border-border pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {evidenceMetrics.map((metric, index) => (
            <EvidenceCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>

        <div className="mb-12 mt-16 max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Selected systems</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Production architecture, with the tradeoffs exposed.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Each case focuses on the problem, system boundary, safeguards, and what I personally owned.</p>
        </div>

        <div className="grid gap-7">
          {caseStudies.map((project, index) => (
            <article key={project.id} id={project.id === "ai-reliability-lab" ? "lab" : undefined} className="group grid overflow-hidden rounded-3xl border border-border bg-background/65 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="relative min-h-64 overflow-hidden border-b border-border bg-black lg:min-h-full lg:border-b-0 lg:border-r">
                {project.video ? (
                  <CaseStudyVideo src={project.video.src} poster={project.video.poster} title={project.title} />
                ) : project.image ? (
                  <Image src={project.image} alt={`${project.title} interface`} width={900} height={600} className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.025]" />
                ) : (
                  <div className="flex h-full min-h-64 items-center justify-center p-8 topology-grid">
                    <div className="rounded-2xl border border-primary/30 bg-black/80 p-7 text-center shadow-[0_0_60px_hsl(var(--primary)/0.15)]">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">direct vs routed</p>
                      <p className="mt-3 text-3xl font-black text-white">eval / score / compare</p>
                    </div>
                  </div>
                )}
                <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/75 px-3 py-1 font-mono text-xs text-white">0{index + 1}</span>
              </div>

              <div className="p-6 sm:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">{project.eyebrow}</p>
                  <Status status={project.status} />
                </div>
                <h3 className="mt-3 text-3xl font-black tracking-tight">{project.title}</h3>

                <dl className="mt-7 grid gap-5 text-sm leading-6 sm:grid-cols-2">
                  <div><dt className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Problem</dt><dd className="mt-2">{project.problem}</dd></div>
                  <div><dt className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Architecture</dt><dd className="mt-2">{project.architecture}</dd></div>
                </dl>

                <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Safety and reliability</p>
                  <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    {project.safeguards.map((safeguard) => <li key={safeguard} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{safeguard}</li>)}
                  </ul>
                </div>

                <p className="mt-5 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Ownership:</span> {project.ownership}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10" data-umami-event={`case-${project.id}`}>
                      {link.label}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mb-10 mt-24 max-w-2xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Open source</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Small primitives extracted from real systems.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {openSourceProjects.map((project) => (
            <a
              key={project.id}
              href={project.links[0].href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} on ${project.kind === "package" ? "npm" : "GitHub"}`}
              className="group rounded-2xl border border-border bg-background/65 p-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-umami-event={`open-source-${project.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {project.kind === "package" ? "Published npm package" : "Public GitHub repository"}
                  </p>
                  <h3 className="mt-2 font-mono text-lg font-black">{project.title}</h3>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.purpose}</p>
              <code className="mt-5 block overflow-x-auto rounded-lg bg-black px-4 py-3 text-xs text-emerald-300">$ {project.command}</code>
              <p className="mt-4 text-xs font-semibold text-foreground">{project.proof}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
