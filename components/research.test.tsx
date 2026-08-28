import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import Research from "@/components/research"

afterEach(cleanup)

describe("Research evidence cards", () => {
  it("renders the four evidence metrics as named cards", () => {
    render(<Research />)

    expect(screen.getByLabelText("MCP tool surface: 43 tools")).toBeInTheDocument()
    expect(screen.getByLabelText("Automated tests: 6,000+")).toBeInTheDocument()
    expect(screen.getByLabelText("Public building blocks: 1 package + 3 repos")).toBeInTheDocument()
    expect(screen.getByLabelText("Reliability benchmark: v2 contract")).toBeInTheDocument()
  })

  it("uses the efficient video preview for the evaluation lab", async () => {
    render(<Research />)

    const video = await screen.findByLabelText("AI Reliability and Evaluation Lab CLI demonstration")
    await waitFor(() => expect(video).toHaveAttribute("src", "/ai-reliability-eval-lab-demo.mp4"))
    expect(video).toHaveAttribute("poster", "/ai-reliability-eval-lab-demo-poster.webp")
    expect(video).toHaveAttribute("preload", "metadata")
    expect(video).toHaveClass("object-cover", "object-left")
    expect(screen.getByRole("button", { name: "Play AI Reliability and Evaluation Lab demonstration" })).toBeInTheDocument()
    expect(screen.getByText("03")).toHaveClass("bottom-4", "left-4")
  })
})
