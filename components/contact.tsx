"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"

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
import { Mail, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"

export default function Contact() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [formStatus, setFormStatus] = useState<null | "success" | "error" | "sending">(null)
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("sending")
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      })
      const data = await res.json()
      setFormStatus(data.success ? "success" : "error")
    } catch {
      setFormStatus("error")
    }
  }

  const socialLinks = [
    {
      Icon: Github,
      href: "https://github.com/tripl3tr3s",
      label: "GitHub",
      handle: "@tripl3tr3s",
      accent: "rgba(139,92,246,0.12)",
      accentBorder: "rgba(139,92,246,0.4)",
      accentColor: "#a78bfa",
    },
    {
      Icon: Twitter,
      href: "https://x.com/TripleeeTres",
      label: "X / Twitter",
      handle: "@TripleeeTres",
      accent: "rgba(14,165,233,0.12)",
      accentBorder: "rgba(14,165,233,0.4)",
      accentColor: "#38bdf8",
    },
    {
      Icon: Linkedin,
      href: "https://www.linkedin.com/in/tripl3tr3s",
      label: "LinkedIn",
      handle: "/in/tripl3tr3s",
      accent: "rgba(59,130,246,0.12)",
      accentBorder: "rgba(59,130,246,0.4)",
      accentColor: "#60a5fa",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-background/90 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-cyan-500 mx-auto mb-8"></div>
          <p className="text-muted-foreground text-lg">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticLink
            href="mailto:hola@tripl3.dev?subject=Engineering%20opportunity"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow"
            data-umami-event="contacto-hire-me"
          >
            Email me →
          </MagneticLink>
          <MagneticLink
            href="https://calendly.com/tripl3tr3s/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl border-2 border-green-500/30 text-foreground hover:bg-green-500/10 hover:border-green-500/50 transition-colors"
            data-umami-event="contacto-book-call"
          >
            Book a call →
          </MagneticLink>
        </motion.div>

        {/* Divider */}
        <div className="max-w-3xl mx-auto mb-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
          <span className="text-muted-foreground text-sm">{t('contact.orSendMessage')}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="bg-card p-8 rounded-2xl border border-green-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
          >
            <h3 className="text-2xl font-bold mb-6">Send a message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="access_key" value="7df330bb-3ecd-4539-a7ad-a2b35a60d14c" />
              <input type="hidden" name="subject" value="New message from tripl3.dev" />
              <input type="checkbox" name="botcheck" className="hidden" />
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder={t('contact.form.namePlaceholder')}
                  className="w-full px-4 py-3 bg-input/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="w-full px-4 py-3 bg-input/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder={t('contact.form.messagePlaceholder')}
                  className="w-full px-4 py-3 bg-input/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-foreground resize-none placeholder:text-muted-foreground/60"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-black font-medium hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formStatus === "sending" ? "Sending..." : t('contact.form.send')}
              </button>

              {formStatus === "success" && (
                <p className="text-green-700 dark:text-green-400 text-sm">Message sent. I will reply to hola@tripl3.dev shortly.</p>
              )}

              {formStatus === "error" && (
                <p className="text-red-400 text-sm">Something went wrong. Try emailing hola@tripl3.dev directly.</p>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-muted/70 dark:bg-gray-900/50 p-8 rounded-2xl border border-green-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <Mail className="w-6 h-6 text-green-700 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{t('contact.info.email')}</h4>
                  <a
                    href="mailto:hola@tripl3.dev"
                    className="text-muted-foreground hover:text-green-400 transition-colors"
                    data-umami-event="contacto-email"
                  >
                    hola@tripl3.dev
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-muted/70 dark:bg-gray-900/50 p-8 rounded-2xl border border-green-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <h4 className="text-xl font-bold mb-6">{t('contact.info.social')}</h4>

              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-4 p-4 rounded-xl overflow-hidden cursor-pointer"
                    style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={isInView
                      ? {
                          opacity: 1,
                          x: 0,
                          backgroundColor: hoveredSocial === index ? link.accent : "transparent",
                          borderColor: hoveredSocial === index ? link.accentBorder : "rgba(255,255,255,0.05)",
                        }
                      : { opacity: 0, x: -16 }
                    }
                    transition={{ duration: 0.35, delay: 0.35 + index * 0.08 }}
                    whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 22 } }}
                    whileTap={{ scale: 0.97 }}
                    onHoverStart={() => setHoveredSocial(index)}
                    onHoverEnd={() => setHoveredSocial(null)}
                    data-umami-event={`contacto-red-${link.label.toLowerCase()}`}
                  >
                    {/* Left accent bar */}
                    <motion.span
                      className="absolute left-0 top-0 h-full w-[3px] rounded-l-xl origin-top"
                      style={{ backgroundColor: link.accentColor }}
                      animate={{ scaleY: hoveredSocial === index ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    />

                    {/* Icon */}
                    <motion.div
                      className="p-2.5 rounded-lg"
                      style={{ backgroundColor: hoveredSocial === index ? link.accent : "var(--muted)" }}
                      animate={{
                        rotate: hoveredSocial === index ? 8 : 0,
                        scale: hoveredSocial === index ? 1.18 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <link.Icon
                        className="w-5 h-5 transition-colors duration-200"
                        style={{ color: hoveredSocial === index ? link.accentColor : undefined }}
                      />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm transition-colors duration-200"
                        style={{ color: hoveredSocial === index ? link.accentColor : undefined }}
                      >
                        {link.label}
                      </p>
                      <p className="text-xs text-muted-foreground/50 truncate">{link.handle}</p>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      animate={{
                        x: hoveredSocial === index ? 3 : 0,
                        y: hoveredSocial === index ? -3 : 0,
                        opacity: hoveredSocial === index ? 1 : 0.25,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      <ArrowUpRight
                        className="w-4 h-4"
                        style={{ color: hoveredSocial === index ? link.accentColor : undefined }}
                      />
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
