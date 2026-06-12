"use client"

import React, { useRef, useState } from "react"
import { motion, useInView, type Variants } from "framer-motion"
import Image from "next/image"
import { ExternalLink, GitBranch, FileText, Lock } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Project {
  id: string
  title: string
  desc: string
  image: string
  tags: string[]
  tech: string[]
  status: "live" | "development"
  privateLabel?: string
  liveLink?: string
  githubLink?: string
}

const projects: Project[] = [
  {
    id: "satMcp",
    title: "SAT-MCP — 43-tool fiscal MCP server",
    desc: "A production MCP server for Mexican tax compliance (CFDI 4.0). Full primitive set plus 8 MCP-UI mini-apps for in-chat document rendering, SSE + HTTP Streamable transport, multi-tenant CSD management, 5 PAC providers behind circuit breakers, and EFOS/EDOS blacklist monitoring. 5,500+ tests, 91%+ coverage, solo-built in strict TypeScript. Private commercial product — happy to walk through the architecture and code in an interview.",
    image: "/MCP_inspector.webp",
    tags: ["Tax Compliance", "MCP Protocol", "Automation", "FinTech"],
    tech: ["TypeScript", "SQLite", "MCP", "XML Signing", "Cryptography"],
    status: "development",
    privateLabel: "Private, Commercial Product",
  },
  {
    id: "disaiConta",
    title: "DISAI_Conta — 3-tier agent system",
    desc: "An AI-native fiscal platform built on SAT-MCP. A Haiku router classifies ten fiscal domains in ~100ms, ten Sonnet domain agents run native tool_use loops (up to 6 iterations, parallel calls, self-correction), and an Expert Registry injects the right SAT catalog resources into context before the first call — which removes an entire class of hallucinated catalog codes without RAG query overhead. Langfuse traces everything; a HITL dashboard gates irreversible operations; streaming SSE chat built in Next.js 16.",
    image: "/DISAI-Conta.webp",
    tags: ["MCP Protocol", "Multi-Agent", "LLM Orchestration", "SaaS"],
    tech: ["Next.js 16", "Claude API", "Anthropic SDK", "MCP Client", "shadcn/ui", "SSE"],
    status: "development",
    privateLabel: "Private, Enterprise IP",
  },
  {
    id: "terminal",
    title: "Crypto / TradFi Analytics Terminal",
    desc: "A real-time analytics dashboard aggregating on-chain and traditional market feeds over dual WebSockets, with a Node.js backend, Redis caching, and graceful degradation for low-latency uptime. React + TypeScript, Dockerized, deployed on Railway/Vercel.",
    image: "/RD_Terminal.webp",
    tags: ["React", "TypeScript", "Docker", "ApexCharts", "Real-Time Data"],
    tech: ["Next.js", "Docker", "Axios", "Redis", "Dual WebSocket", "Custom API"],
    status: "live",
    liveLink: "https://retaildao-terminal.vercel.app/",
    githubLink: "https://github.com/RetailDAO/website",
  },
  {
    id: "n8nStarter",
    title: "n8n freelancer starter",
    desc: "A one-click Railway template for self-hosted n8n, production-configured, built to replace the $20–30/mo Zapier/Make dependency for small teams.",
    image: "/n8n_freelancer_starter.webp",
    tags: ["Open Source", "Automation", "Self-Hosting", "Cost-Optimization"],
    tech: ["n8n", "SQLite", "Docker", "Railway", "Bash"],
    status: "development",
    githubLink: "https://github.com/tripl3tr3s/n8n-freelancer-starter",
  },
]

const analysisReports = [
  {
    title: "On-Chain Data Signals: A Framework for Market Structure Analysis",
    year: 2025,
    link: "https://docs.google.com/document/d/e/2PACX-1vQN6k3vqjq8jraYzvwWvHgr7vMSkOC-sLxIUuUpob-u8k6r1pHAQDFvkV2VuAWQEFCWkkJ1BFYErfVc/pub",
  },
  {
    title: "BNB Ecosystem Architecture: A Technical and Economic Assessment",
    year: 2024,
    link: "https://docs.google.com/document/d/e/2PACX-1vRVg4Ir_mafKgxc2GZixv6pKSDjilH1AlLCr_DzsPFN10anWUHEXC9zZ9Kkz7NvaKTs6CTK-UIQRyp8/pub",
  },
  {
    title: "SEI Protocol: Tokenomics, Design Tradeoffs, and Investment Thesis",
    year: 2024,
    link: "https://docs.google.com/document/d/e/2PACX-1vRVg4Ir_mafKgxc2GZixv6pKSDjilH1AlLCr_DzsPFN10anWUHEXC9zZ9Kkz7NvaKTs6CTK-UIQRyp8/pub",
  },
  {
    title: "Institutional Entry into Digital Asset Markets: A Structural Analysis",
    year: 2024,
    link: "https://docs.google.com/document/d/e/2PACX-1vQECKZHvd8iOw5y8LYNDEVgQP50xMQzC7oIFlOfK1lMPpWJfYB2aR2qDEpIMfOekgUUR2cDYd_tu0Dm/pub",
  },
  {
    title: "Speculative Asset Cycles: Why Narrative-Driven Markets Fail at Scale",
    year: 2024,
    link: "https://docs.google.com/document/d/e/2PACX-1vTqsPMavIVPp2Sf2XY3GPEMRg4-cLfZ4WuuWZNAf4JYWIlWM7S8f4TMnc1-XTfmRhedsxcCw8xeZiW9/pub",
  },
  {
    title: "Full Research Archive",
    year: "2024–2025",
    link: "https://docs.google.com/document/d/e/2PACX-1vRAKgSHq_Ui8XC8nHRVDLmy1nMz8OzsHkj0-vsanC0GdFQ7VWEyeDsq794gpgnre5nMxVHSuRVQGaom/pub",
  },
]

function ProjectCard({ project, itemVariants }: { project: Project; itemVariants: Variants }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const py = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: py * -5, y: px * 5 })
    setImgOffset({ x: px * -8, y: py * -6 })
    if (spotRef.current) {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      spotRef.current.style.background = `radial-gradient(220px circle at ${x}% ${y}%, rgba(16,185,129,0.1), transparent 70%)`
      spotRef.current.style.opacity = "1"
    }
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setImgOffset({ x: 0, y: 0 })
    if (spotRef.current) spotRef.current.style.opacity = "0"
  }

  return (
    <motion.div variants={itemVariants}>
      <motion.div
        ref={cardRef}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="tilt-card bg-card/30 rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-colors group relative cursor-pointer"
        whileTap={{ scale: 0.985, transition: { type: "spring", stiffness: 500, damping: 20 } }}
        style={{ transformPerspective: 1000 }}
      >
        {/* Cursor spotlight */}
        <div
          ref={spotRef}
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
          style={{ opacity: 0 }}
        />

        {/* Image with counter-parallax */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            animate={{ x: imgOffset.x, y: imgOffset.y }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute inset-0 scale-[1.14]"
          >
            <Image
              src={project.image}
              alt={project.title}
              width={500}
              height={300}
              className="w-full h-full object-cover"
            />
          </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            project.status === "live"
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
          }`}>
            {project.status === "live" ? "Live" : "In Development"}
          </span>
        </div>
      </div>

      <div className="p-6 relative z-20">
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">{project.desc}</p>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Tech Stack:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech, i) => (
              <span key={i} className="px-2 py-1 text-xs font-medium rounded bg-muted/50 text-muted-foreground border border-border">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>

        {project.privateLabel ? (
          <div className="flex items-center gap-2 mt-2">
            <Lock className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground/60 font-medium">{project.privateLabel}</span>
          </div>
        ) : (
          <div className="flex gap-3">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all"
                data-umami-event={`proyecto-demo-${project.id}`}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.githubLink ? (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-muted-foreground border border-border rounded-lg hover:bg-muted/70 transition-all"
                data-umami-event={`proyecto-codigo-${project.id}`}
              >
                <GitBranch className="w-4 h-4" />
                Code
              </a>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-muted-foreground border border-border rounded-lg cursor-help opacity-60">
                    <GitBranch className="w-4 h-4" />
                    Code
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private Repository</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      </motion.div>
    </motion.div>
  )
}

export default function Research() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <TooltipProvider>
      <section id="projects" className="py-20 bg-gradient-to-b from-background to-background/90 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

        <div className="container mx-auto px-4">
          {/* Projects heading */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-cyan-500 mx-auto"></div>
          </div>

          {/* Project cards grid */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} itemVariants={itemVariants} />
            ))}
          </motion.div>

          {/* Systems Analysis subsection */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-3">Systems Analysis</h3>
              <p className="text-muted-foreground">
                Before building AI systems, I spent years producing deep technical research on complex
                economic and protocol systems: consensus mechanism design, cryptoeconomic incentive
                structures, Layer 2 scaling architectures, and on-chain market microstructure. The same
                pattern recognition and architectural thinking now drives how I design and reason about
                AI infrastructure.
              </p>
            </div>

            <div className="space-y-3">
              {analysisReports.map((report, index) => (
                <motion.a
                  key={index}
                  href={report.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-green-500/30 hover:bg-green-500/5 transition-colors group"
                  whileHover={{ x: 3, transition: { type: "spring", stiffness: 500, damping: 22 } }}
                  data-umami-event={`analisis-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.2, rotate: -8, transition: { type: "spring", stiffness: 400, damping: 12 } }}>
                      <FileText className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                    </motion.div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors draw-underline">
                      {report.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-xs text-muted-foreground/60">{report.year}</span>
                    <motion.div whileHover={{ x: 2, y: -2, transition: { type: "spring", stiffness: 500, damping: 15 } }}>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </motion.div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
