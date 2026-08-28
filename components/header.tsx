"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { name: "Work", href: "#work" },
  { name: "Lab", href: "#lab" },
  { name: "Writing", href: "#writing" },
  { name: "About", href: "#about" },
  ]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    firstLinkRef.current?.focus()
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  return (
    <header className="glass-nav fixed left-0 top-0 z-50 w-screen border-b border-border/70">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Image src="/dado_333_amarillo_sin fondo.webp" alt="" width={34} height={34} className="h-8 w-8 object-contain" priority />
          <span className="font-mono text-sm font-black tracking-[0.14em] sm:text-base">TRIPLE-TRES<span className="text-primary">/333</span></span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <nav aria-label="Primary navigation" className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-umami-event={`nav-${item.name.toLowerCase()}`}>{item.name}</Link>
            ))}
          </nav>
          <a href="#contact" className="rounded-lg border border-primary/40 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10" data-umami-event="nav-contact">Contact</a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button ref={menuButtonRef} type="button" onClick={() => setIsOpen((open) => !open)} className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border" aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? "Close navigation" : "Open navigation"}>
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-border bg-background/95 p-4 backdrop-blur-xl md:hidden">
          <div className="container mx-auto grid gap-1">
            {navItems.map((item, index) => (
              <Link key={item.name} ref={index === 0 ? firstLinkRef : undefined} href={item.href} onClick={() => setIsOpen(false)} className="rounded-lg px-4 py-3 text-base font-semibold hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{item.name}</Link>
            ))}
            <a href="#contact" onClick={() => setIsOpen(false)} className="mt-2 rounded-lg bg-primary px-4 py-3 text-center font-bold text-primary-foreground">Contact</a>
          </div>
        </nav>
      )}
    </header>
  )
}
