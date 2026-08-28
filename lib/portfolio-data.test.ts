import { describe, expect, it } from "vitest"
import { caseStudies, evidenceMetrics, openSourceProjects, topologyNodes } from "@/lib/portfolio-data"

const isPublicUrl = (value: string) => /^https:\/\//.test(value) && !value.includes("example.com")

describe("portfolio data contracts", () => {
  it("uses unique stable IDs across each collection", () => {
    for (const collection of [caseStudies, evidenceMetrics, openSourceProjects, topologyNodes]) {
      const ids = collection.map((item) => item.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it("requires verified evidence to point to a public URL", () => {
    const verified = evidenceMetrics.filter((item) => item.status === "verified")
    expect(verified.length).toBeGreaterThan(0)
    for (const item of verified) {
      expect(isPublicUrl(item.href)).toBe(true)
    }
  })

  it("keeps the evaluation baseline pending until a reviewed report exists", () => {
    const evaluationLab = caseStudies.find((project) => project.id === "ai-reliability-lab")
    expect(evaluationLab?.status).toBe("pending")
    expect(evaluationLab?.video).toEqual({
      src: "/ai-reliability-eval-lab-demo.mp4",
      poster: "/ai-reliability-eval-lab-demo-poster.webp",
    })
  })

  it("does not reuse external destinations for distinct project records", () => {
    const links = [...caseStudies, ...openSourceProjects]
      .flatMap((item) => item.links)
      .map((link) => link.href)
    expect(new Set(links).size).toBe(links.length)
  })

  it("distinguishes the published package from source-only repositories", () => {
    expect(openSourceProjects[0]).toMatchObject({
      id: "efos-risk-graph",
      kind: "package",
      command: "pnpm add efos-risk-graph",
    })

    const repositories = openSourceProjects.filter((project) => project.kind === "repository")
    expect(repositories).toHaveLength(3)
    expect(repositories.map((project) => project.id)).toEqual([
      "mcp-tool-idempotency",
      "llm-cost-router",
      "agentic-tool-loop",
    ])

    for (const repository of repositories) {
      expect(repository.command).toBe(`git clone ${repository.links[0].href}.git`)
    }

    expect(evidenceMetrics.find((item) => item.id === "open-source")?.value).toBe(
      "1 package + 3 repos",
    )
  })
})
