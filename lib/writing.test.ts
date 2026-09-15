import path from "node:path"
import { describe, expect, it } from "vitest"
import { getGitFirstCommitDate } from "@/lib/writing"

describe("getGitFirstCommitDate", () => {
  it("returns a valid ISO timestamp for a file with git history", () => {
    const filePath = path.join(process.cwd(), "package.json")
    const date = getGitFirstCommitDate(filePath)

    expect(date).not.toBeNull()
    expect(Number.isNaN(new Date(date as string).getTime())).toBe(false)
  })

  it("returns null for a path with no git history", () => {
    const filePath = path.join(process.cwd(), "content", "writing", "this-file-does-not-exist.md")
    expect(getGitFirstCommitDate(filePath)).toBeNull()
  })
})
