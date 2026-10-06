"use client"

import AgentTopology from "@/components/agent-topology"

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-4 pb-12 pt-24 sm:pt-28 lg:pb-14 lg:pt-32">
      <div className="absolute inset-0 hero-grid" aria-hidden="true" />
      <div className="absolute left-1/2 top-20 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" />
      <div className="container relative mx-auto grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">AI systems engineer / TypeScript / Mexico</p>
          <h1 className="text-balance text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">I build reliable AI systems that ship.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">I design bounded agent loops, MCP infrastructure, evaluation systems, and human approval surfaces. My work turns difficult AI behavior into typed, observable software a team can operate.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#work" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_0_28px_hsl(var(--primary)/0.24)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" data-evento="clic" data-evento-id="hero-explore-systems" data-evento-tipo="cta">Explore systems</a>
            <a href="/cv" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background/50 px-6 py-3 font-semibold transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-evento="cv-abierto" data-evento-origen="hero">View resume</a>
          </div>
          <dl className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-border/70 pt-5">
            <div><dt className="text-xs text-muted-foreground">MCP surface</dt><dd className="mt-1 font-mono text-lg font-bold">43 tools</dd></div>
            <div><dt className="text-xs text-muted-foreground">Test suite</dt><dd className="mt-1 font-mono text-lg font-bold">6,000+</dd></div>
            <div><dt className="text-xs text-muted-foreground">Public proof</dt><dd className="mt-1 font-mono text-lg font-bold">1 pkg + 3 repos</dd></div>
          </dl>
        </div>
        <AgentTopology />
      </div>
    </section>
  )
}
