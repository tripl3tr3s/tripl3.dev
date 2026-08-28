import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("presents the hiring proposition and core evidence", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { level: 1, name: "I build reliable AI systems that ship." })).toBeVisible()
  await expect(page.getByRole("link", { name: "Explore systems" })).toHaveAttribute("href", "#work")
  await expect(page.getByText("43 tools").first()).toBeVisible()
  await expect(page.getByRole("heading", { name: "AI Reliability and Evaluation Lab" })).toBeVisible()
})

test("supports keyboard exploration of the agent topology", async ({ page }) => {
  await page.goto("/")
  const router = page.getByRole("button", { name: "Router" })
  await router.focus()
  await page.keyboard.press("ArrowRight")

  await expect(page.getByRole("button", { name: "Expert Registry" })).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByText(/Injects domain tools, policies/)).toBeVisible()
})

test("keeps the evidence node above the topology description", async ({ page }) => {
  await page.goto("/")

  const evidence = page.getByRole("button", { name: "Observability and Evals" })
  const description = page.locator(".topology-shell [aria-live='polite']")
  const evidenceBox = await evidence.boundingBox()
  const descriptionBox = await description.boundingBox()

  expect(evidenceBox).not.toBeNull()
  expect(descriptionBox).not.toBeNull()
  expect((evidenceBox?.y ?? 0) + (evidenceBox?.height ?? 0)).toBeLessThan(descriptionBox?.y ?? 0)
})

test("has no serious accessibility violations", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page }).analyze()
  const materialViolations = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")
  expect(materialViolations).toEqual([])
})

test("keeps the primary mobile action in the first viewport without horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only layout assertion")
  await page.goto("/")
  const action = page.getByRole("link", { name: "Explore systems" })
  const box = await action.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.y ?? 1_000) + (box?.height ?? 0)).toBeLessThanOrEqual(844)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
})

test("uses the static topology fallback when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(page.locator(".topology-shell canvas")).toHaveCount(0)
  await expect(page.locator(".topology-shell img")).toBeVisible()
})
