"use client"

import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { useState } from "react"
import { contactFormSchema, web3FormsResponseSchema, type ContactFormValues } from "@/lib/contact-schema"

type FormStatus = "idle" | "sending" | "success" | "error"
type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const parsed = contactFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    })

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      })
      setStatus("error")
      return
    }

    setErrors({})
    setStatus("sending")
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "7df330bb-3ecd-4539-a7ad-a2b35a60d14c",
          subject: "New message from tripl3.dev",
          from_name: parsed.data.name,
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
          botcheck: formData.get("botcheck") ?? "",
        }),
      })
      const result = web3FormsResponseSchema.safeParse(await response.json())
      if (!response.ok || !result.success || !result.data.success) throw new Error("Submission failed")
      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="relative border-t border-border py-20 sm:py-28">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Bring me the difficult systems problem.</h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">I am open to applied AI, AI platform, and agent systems roles. I also work with selected teams that need production MCP or evaluation infrastructure.</p>

          <div className="mt-8 grid gap-3">
            <a href="mailto:hola@tripl3.dev?subject=AI%20engineering%20opportunity" className="inline-flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 font-semibold transition-colors hover:border-primary/40"><Mail className="h-5 w-5 text-primary" aria-hidden="true" />hola@tripl3.dev</a>
            <a href="https://github.com/tripl3tr3s" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 font-semibold transition-colors hover:border-primary/40"><Github className="h-5 w-5 text-primary" aria-hidden="true" />GitHub<ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/tripl3tr3s" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 font-semibold transition-colors hover:border-primary/40"><Linkedin className="h-5 w-5 text-primary" aria-hidden="true" />LinkedIn<ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-border bg-card/50 p-6 shadow-2xl sm:p-8">
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-bold">Name</label>
              <input id="name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background/70 px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {errors.name && <p id="name-error" className="mt-2 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-bold">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background/70 px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {errors.email && <p id="email-error" className="mt-2 text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="message" className="text-sm font-bold">What are you building?</label>
            <textarea id="message" name="message" rows={7} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} className="mt-2 w-full resize-y rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            {errors.message && <p id="message-error" className="mt-2 text-sm text-red-500">{errors.message}</p>}
          </div>
          <button type="submit" disabled={status === "sending"} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-black text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{status === "sending" ? "Sending..." : "Send message"}</button>
          <div className="mt-4 min-h-6 text-sm" role="status" aria-live="polite">
            {status === "success" && <p className="text-emerald-700 dark:text-emerald-400">Message sent. I will reply shortly.</p>}
            {status === "error" && Object.keys(errors).length === 0 && <p className="text-red-500">Something went wrong. Email hola@tripl3.dev directly.</p>}
          </div>
        </form>
      </div>
    </section>
  )
}
