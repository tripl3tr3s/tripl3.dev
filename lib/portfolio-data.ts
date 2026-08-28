export type EvidenceStatus = "verified" | "private" | "pending"

export type ProjectEvidence =
  | {
      readonly id: string
      readonly status: "verified"
      readonly label: string
      readonly value: string
      readonly href: string
    }
  | {
      readonly id: string
      readonly status: "private" | "pending"
      readonly label: string
      readonly value: string
      readonly note: string
    }

export interface ProjectLink {
  readonly label: string
  readonly href: string
}

export interface CaseStudy {
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly problem: string
  readonly architecture: string
  readonly safeguards: readonly string[]
  readonly ownership: string
  readonly status: EvidenceStatus
  readonly links: readonly ProjectLink[]
  readonly image?: string
  readonly video?: {
    readonly src: string
    readonly poster: string
  }
}

export interface OpenSourceProject {
  readonly id: string
  readonly title: string
  readonly kind: "package" | "repository"
  readonly purpose: string
  readonly command: string
  readonly proof: string
  readonly links: readonly ProjectLink[]
}

export interface TopologyNode {
  readonly id: string
  readonly label: string
  readonly category: string
  readonly description: string
  readonly position: { readonly x: number; readonly y: number }
  readonly evidenceHref?: string
}

export interface TopologyEdge {
  readonly from: string
  readonly to: string
}

export const evidenceMetrics = [
  {
    id: "mcp-tools",
    status: "private",
    label: "MCP tool surface",
    value: "43 tools",
    note: "Private commercial system",
  },
  {
    id: "test-suite",
    status: "private",
    label: "Automated tests",
    value: "6,000+",
    note: "Combined private platform suite",
  },
  {
    id: "open-source",
    status: "verified",
    label: "Public building blocks",
    value: "1 package + 3 repos",
    href: "https://github.com/tripl3tr3s?tab=repositories",
  },
  {
    id: "evaluation-lab",
    status: "pending",
    label: "Reliability benchmark",
    value: "v2 contract",
    note: "Reviewed live baseline pending",
  },
] satisfies readonly ProjectEvidence[]

export const caseStudies = [
  {
    id: "sat-mcp",
    eyebrow: "Fiscal infrastructure",
    title: "SAT-MCP",
    problem: "Make rule-heavy Mexican tax operations available to AI agents without giving them unbounded access.",
    architecture: "A typed 43-tool MCP server with resources, prompts, UI surfaces, multi-tenant credentials, and five PAC integrations behind circuit breakers.",
    safeguards: ["Domain tool allowlists", "Schema validation at every boundary", "HITL for irreversible actions"],
    ownership: "Designed and built solo in TypeScript.",
    status: "private",
    links: [{ label: "Product context", href: "https://disai.mx" }],
    image: "/MCP_inspector.webp",
  },
  {
    id: "disai-conta",
    eyebrow: "Agent orchestration",
    title: "DISAI_Conta",
    problem: "Route fiscal requests to the right specialist while controlling tool scope, cost, and unsupported catalog claims.",
    architecture: "A Haiku router selects one of ten domain agents. An Expert Registry injects scoped tools and live resources before the Sonnet tool loop begins.",
    safeguards: ["Per-domain tool scopes", "Bounded self-correcting loops", "Langfuse and human approval surfaces"],
    ownership: "Product architecture, orchestration, frontend, and platform integration.",
    status: "private",
    links: [{ label: "Private beta", href: "https://app.disai.mx" }],
    image: "/DISAI-Conta.webp",
  },
  {
    id: "ai-reliability-lab",
    eyebrow: "Public evaluation",
    title: "AI Reliability and Evaluation Lab",
    problem: "Turn agent-quality claims into reproducible evidence across routing, tool use, failure recovery, cost, and latency.",
    architecture: "A versioned synthetic benchmark compares direct and routed agents with immutable datasets, bounded spend, raw JSONL, and CI regression gates.",
    safeguards: ["Secretless pull request validation", "No hand-entered results", "Reviewed baseline promotion"],
    ownership: "Designed as the public proof layer joining the production primitives.",
    status: "pending",
    links: [{ label: "View repository", href: "https://github.com/tripl3tr3s/ai-reliability-eval-lab" }],
    video: {
      src: "/ai-reliability-eval-lab-demo.mp4",
      poster: "/ai-reliability-eval-lab-demo-poster.webp",
    },
  },
] satisfies readonly CaseStudy[]

export const openSourceProjects = [
  {
    id: "efos-risk-graph",
    title: "efos-risk-graph",
    kind: "package",
    purpose: "Published TypeScript package for explainable SAT Article 69-B supplier-risk propagation.",
    command: "pnpm add efos-risk-graph",
    proof: "Published on npm with verifiable provenance and public source",
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/efos-risk-graph" },
      { label: "GitHub", href: "https://github.com/tripl3tr3s/efos-risk-graph" },
    ],
  },
  {
    id: "mcp-tool-idempotency",
    title: "mcp-tool-idempotency",
    kind: "repository",
    purpose: "Public reference implementation for idempotent MCP tool execution and replay-safe side effects.",
    command: "git clone https://github.com/tripl3tr3s/mcp-tool-idempotency.git",
    proof: "Public GitHub repository, not currently published to npm",
    links: [{ label: "GitHub", href: "https://github.com/tripl3tr3s/mcp-tool-idempotency" }],
  },
  {
    id: "llm-cost-router",
    title: "llm-cost-router",
    kind: "repository",
    purpose: "Public TypeScript reference for tiered model routing, cache-aware pricing, and session budget guards.",
    command: "git clone https://github.com/tripl3tr3s/llm-cost-router.git",
    proof: "Public GitHub repository, not currently published to npm",
    links: [{ label: "GitHub", href: "https://github.com/tripl3tr3s/llm-cost-router" }],
  },
  {
    id: "agentic-tool-loop",
    title: "agentic-tool-loop",
    kind: "repository",
    purpose: "Small public Anthropic tool-use loop demonstrating bounded turns, failure feedback, and self-correction.",
    command: "git clone https://github.com/tripl3tr3s/agentic-tool-loop.git",
    proof: "Public GitHub repository, not currently published to npm",
    links: [{ label: "GitHub", href: "https://github.com/tripl3tr3s/agentic-tool-loop" }],
  },
] satisfies readonly OpenSourceProject[]

export const topologyNodes = [
  {
    id: "router",
    label: "Router",
    category: "Triage",
    description: "Classifies the request and selects the narrowest expert that can safely handle it.",
    position: { x: 50, y: 12 },
  },
  {
    id: "registry",
    label: "Expert Registry",
    category: "Context",
    description: "Injects domain tools, policies, and live catalog resources before the first model call.",
    position: { x: 84, y: 34 },
  },
  {
    id: "agents",
    label: "Domain Agents",
    category: "Reasoning",
    description: "Runs bounded tool-use loops with parallel calls, visible errors, and self-correction.",
    position: { x: 78, y: 76 },
  },
  {
    id: "tools",
    label: "MCP Tools",
    category: "Execution",
    description: "Executes typed fiscal operations through tenant-scoped credentials and validated inputs.",
    position: { x: 22, y: 76 },
  },
  {
    id: "hitl",
    label: "HITL",
    category: "Control",
    description: "Stops irreversible work at an explicit approval boundary before side effects occur.",
    position: { x: 16, y: 34 },
  },
  {
    id: "evidence",
    label: "Observability and Evals",
    category: "Evidence",
    description: "Traces cost, latency, tool behavior, failures, and regression outcomes from raw results.",
    position: { x: 50, y: 90 },
    evidenceHref: "https://github.com/tripl3tr3s/ai-reliability-eval-lab",
  },
] satisfies readonly TopologyNode[]

export const topologyEdges = [
  { from: "router", to: "registry" },
  { from: "registry", to: "agents" },
  { from: "agents", to: "tools" },
  { from: "tools", to: "hitl" },
  { from: "hitl", to: "router" },
  { from: "agents", to: "evidence" },
  { from: "tools", to: "evidence" },
] satisfies readonly TopologyEdge[]
