"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useCallback } from "react"
import { ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface Post {
  title: string
  excerpt: string
  link: string
  date: string
  tags: string[]
  internal?: boolean
}

const posts: Post[] = [
  {
    title: "FDE Field Notes: Starting an AI-Native Build With a Facilities Audit",
    excerpt: "New engagement: designing a custom AI-native operating system for a Mexican waste management company with zero digital infrastructure today. Before any architecture gets decided, it starts with a levantamiento - a real facilities walkthrough.",
    link: "/writing/fde-field-notes-ai-native-build-facilities-audit",
    date: "Sep 2026",
    tags: ["Build in Public", "Forward Deployed Engineering", "DISAI"],
    internal: true,
  },
  {
    title: "How Many Hops Are You From an EFOS?",
    excerpt: "Traditional 69-B monitoring only asks 'is my supplier blacklisted?' But the risk that kills a deduction lives deeper in the network. efos-risk-graph models invoicing as a directed graph, propagates SAT blacklist risk with per-hop attenuation, explains the exact chain, and flags invoicing carousels. Open-core, verified by hand. Originally published in Spanish.",
    link: "/writing/how-many-hops-are-you-from-an-efos",
    date: "Jul 2026",
    tags: ["Fiscal Tech", "Open Source", "Graph Theory"],
    internal: true,
  },
  {
    title: "80% of Requests Never Hit the Expensive Model",
    excerpt: "How 3-tier routing cuts cost without degrading quality: a Haiku classifier (~100ms, 60 tokens) → domain specialists → Sonnet for full orchestration. Routing as architecture, not afterthought.",
    link: "/writing/80-percent-of-requests-never-hit-the-expensive-model",
    date: "May 2026",
    tags: ["LLM Orchestration", "Cost Optimization", "MCP"],
    internal: true,
  },
  {
    title: "Building AI-Native Mexican Fiscal Compliance: 7 Months Solo",
    excerpt: "CFDI 4.0, EFOS/EDOS blacklist monitoring, CSD state management: rule-dense fiscal compliance is the ideal AI domain. What 'AI-native' actually means when engineered, not marketed.",
    link: "/writing/building-ai-native-mexican-fiscal-compliance-7-months-solo",
    date: "May 2026",
    tags: ["AI Engineering", "Build in Public", "DISAI"],
    internal: true,
  },
  {
    title: "AI Strategy is Not Business Strategy with AI Bolted On",
    excerpt: "Why AI initiatives that don't tie back to clear business drivers are expensive experiments. What MLOps, PoC scoping, and responsible design actually look like in practice.",
    link: "/writing/ai-strategy-is-not-business-strategy-with-ai-bolted-on",
    date: "Mar 2026",
    tags: ["AI Strategy", "MLOps", "Engineering"],
    internal: true,
  },
  {
    title: "122,449 Operations Per Minute: Benchmarking a Production MCP Server",
    excerpt: "How a minimal n8n Railway deployment and a custom MCP server hit 122x the market leader's throughput, with 0% error rate at 1.16ms average latency. Originally published in Spanish.",
    link: "/writing/122449-operations-per-minute-mcp-server",
    date: "Nov 2025",
    tags: ["MCP Server", "Performance", "Benchmarking"],
    internal: true,
  },
]

export default function Writing() {
  const sectionRef = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Drag state
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab")

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    setCursor("grabbing")
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    setCursor("grab")
  }, [])

  const scroll = useCallback((dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="writing" className="py-20 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Writing</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-cyan-500 mx-auto mb-8"></div>
          <p className="text-muted-foreground text-lg">
            I write about what I actually build: the non-obvious problems, the design decisions, and what breaks in production.
          </p>
        </div>

        <div className="relative" ref={sectionRef}>
          {/* Fade hints */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Nav buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 border border-border hover:border-green-500/40 hover:bg-green-500/10 transition-colors shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 border border-border hover:border-green-500/40 hover:bg-green-500/10 transition-colors shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex gap-6 overflow-x-auto px-8 pb-4 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
            style={{ cursor }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {posts.map((post, index) => {
              const cardContent = (
                <>
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary to-cyan-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 ease-out rounded-l-2xl" />

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground/60">
                      {post.date}
                      {!post.internal && " · LinkedIn"}
                    </span>
                    {post.internal ? (
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </>
              )

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="snap-start shrink-0 w-[85vw] sm:w-[360px]"
                >
                  {post.internal ? (
                    <Link
                      href={post.link}
                      className="h-full flex flex-col bg-card/30 rounded-2xl border border-border hover:border-green-500/30 hover:bg-green-500/5 hover:-translate-y-1.5 active:scale-[0.98] active:translate-y-0 transition-all duration-300 ease-out group p-6 relative overflow-hidden"
                      data-umami-event={`writing-post-${index}`}
                      draggable={false}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <motion.a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-full flex flex-col bg-card/30 rounded-2xl border border-border hover:border-green-500/30 hover:bg-green-500/5 transition-colors group p-6 relative overflow-hidden"
                      whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      data-umami-event={`writing-post-${index}`}
                      draggable={false}
                    >
                      {cardContent}
                    </motion.a>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
