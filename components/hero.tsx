"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

function MagneticLink({
  href,
  children,
  className,
  target,
  rel,
  "data-umami-event": umamiEvent,
}: {
  href: string
  children: React.ReactNode
  className: string
  target?: string
  rel?: string
  "data-umami-event"?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.38,
      y: (e.clientY - rect.top - rect.height / 2) * 0.38,
    })
  }

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      data-umami-event={umamiEvent}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.94 }}
      className={className}
    >
      {children}
    </motion.a>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 md:pt-16">
      {/* Background grid effect */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-gradient-to-b"></div>
      </div>

      {/* Animated glow orb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-[100px] z-0"
      />

      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left order-2 md:order-1"
          >
            {/* Subhead badge — clip-path reveal */}
            <div
              className="mb-6 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-green-400 text-sm font-medium border border-primary/20 dark:border-green-500/20 animate-badge-reveal"
              style={{ animationDelay: "0.25s" }}
            >
              MCP server design · Multi-agent orchestration · Langfuse observability · HITL systems
            </div>

            {/* Static headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-green-700 via-teal-600 to-green-700 dark:from-green-400 dark:via-cyan-400 dark:to-green-400 bg-clip-text text-transparent leading-tight"
            >
              I build AI systems that ship.
            </motion.h1>

            {/* Body copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto md:mx-0"
            >
              AI engineer building production-grade LLM and agent systems in TypeScript. I designed
              and shipped a 43-tool MCP server and a multi-tier Claude orchestration layer from zero —
              backed by 6,000+ tests and end-to-end observability. I build for production, not demos.
              Open to AI engineering roles where I can bring that to a team.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full sm:w-auto px-4 sm:px-0"
            >
              <MagneticLink
                href="#projects"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold text-center hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] transition-shadow"
                data-umami-event="cta-ver-proyectos"
              >
                View my work
              </MagneticLink>
              <MagneticLink
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-green-500/30 text-foreground font-semibold text-center hover:bg-green-500/10 hover:border-green-500/50 transition-colors"
                data-umami-event="cta-lets-talk"
              >
                Get in touch
              </MagneticLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="relative block order-1 md:order-2"
          >
            <div className="relative w-full h-[280px] md:h-[400px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-green-500/20 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                <Image
                  src="/architect-anchor.webp"
                  alt="AI Systems Engineer"
                  width={500}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 1.2 }}
                className="hidden sm:block absolute -left-10 bottom-10 p-4 bg-gray-950/90 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] max-w-[200px]"
              >
                <div className="text-green-400 font-mono text-xs">
                  {"// MCP tool execution"}
                  <br />
                  {"const result = await mcp.callTool("}
                  <br />
                  {"  'generar-factura', params"}
                  <br />
                  {");"}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 1.5 }}
                className="hidden sm:block absolute -right-10 top-10 p-4 bg-gray-950/90 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] max-w-[200px]"
              >
                <div className="text-cyan-400 font-mono text-xs">
                  {"// Claude API — Anthropic"}
                  <br />
                  {"const client = new Anthropic();"}
                  <br />
                  {"const msg = await client.messages"}
                  <br />
                  {"  .create({ model, tools });"}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          delay: 1.3,
          y: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
          opacity: { duration: 1 },
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-2 bg-green-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
