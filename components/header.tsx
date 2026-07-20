"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/theme-toggle"

const words = ["MCP PROTOCOL", "AGENTIC SYSTEMS", "N8N WORKFLOWS", "LLM ORCHESTRATION", "CLAUDE API", "SCALABLE ENGINEERING", "INTELLIGENT AGENTS"]

const navItems = [
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
  { name: "Projects", href: "#projects" },
  { name: "Writing", href: "#writing" },
  { name: "Contact", href: "#contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const currentWord = words[currentWordIndex]
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      if (displayedText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1))
        }, 100)
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 50)
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayedText, currentWordIndex, isTyping, mounted])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              whileHover={{ rotate: 20, scale: 1.15, transition: { type: "spring", stiffness: 500, damping: 12 } }}
              className="relative w-6 h-6 md:w-8 md:h-8"
            >
              {mounted && (
                <Image
                  src={theme === "dark" ? "/dado_333_amarillo_sin fondo.webp" : "/dado_333_negro_sin fondo.webp"}
                  alt="333 Research Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.3 }}
              className="text-lg md:text-2xl font-bold font-mono"
            >
              <span className="text-foreground">
                <span className="text-primary">TRIPLE-TRES</span>
                {!isMobile && (
                  <>
                    <span className="text-primary">/</span>
                    {displayedText}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-primary"
                    >
                      |
                    </motion.span>
                  </>
                )}
              </span>
            </motion.div>
          </Link>

          {isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-3 text-foreground active:scale-95 transition-transform"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-2xl overflow-hidden"
                >
                  <nav className="flex flex-col p-4 space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-4 py-4 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all text-lg font-medium flex items-center justify-between group"
                        onClick={() => setIsOpen(false)}
                        data-umami-event={`nav-movil-${item.name}`}
                      >
                        {item.name}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">→</span>
                      </Link>
                    ))}
                  </nav>
                </motion.div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors relative group"
                    data-umami-event={`nav-${item.name}`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
