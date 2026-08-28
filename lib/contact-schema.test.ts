import { describe, expect, it } from "vitest"
import { contactFormSchema, web3FormsResponseSchema } from "@/lib/contact-schema"

describe("contactFormSchema", () => {
  it("trims and accepts valid contact details", () => {
    expect(
      contactFormSchema.parse({
        name: "  Ada Lovelace  ",
        email: "ada@example.com",
        message: "  I would like to discuss an AI platform role.  ",
      }),
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to discuss an AI platform role.",
    })
  })

  it.each([
    { name: "", email: "ada@example.com", message: "Hello" },
    { name: "Ada", email: "not-an-email", message: "Hello" },
    { name: "Ada", email: "ada@example.com", message: "" },
  ])("rejects invalid contact details", (input) => {
    expect(contactFormSchema.safeParse(input).success).toBe(false)
  })
})

describe("web3FormsResponseSchema", () => {
  it("accepts the response shape used by the contact service", () => {
    expect(web3FormsResponseSchema.parse({ success: true }).success).toBe(true)
    expect(web3FormsResponseSchema.parse({ success: false, message: "Rejected" }).success).toBe(false)
  })

  it("rejects malformed service responses", () => {
    expect(web3FormsResponseSchema.safeParse({ ok: true }).success).toBe(false)
  })
})
