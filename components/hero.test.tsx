import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/agent-topology", () => ({
  default: () => <div aria-label="Interactive agent system topology" />,
}))

import Hero from "@/components/hero"

describe("Hero", () => {
  it("puts the hiring proposition and primary actions first", () => {
    render(<Hero />)

    expect(
      screen.getByRole("heading", { level: 1, name: "I build reliable AI systems that ship." }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Explore systems" })).toHaveAttribute("href", "#work")
    expect(screen.getByRole("link", { name: "View resume" })).toHaveAttribute("href", "/cv")
    expect(screen.getByLabelText("Interactive agent system topology")).toBeInTheDocument()
    expect(screen.getByText("1 pkg + 3 repos")).toBeInTheDocument()
  })
})
