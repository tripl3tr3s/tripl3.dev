"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
      whileTap={{ scale: 0.95 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: resolvedTheme === "dark" ? 0 : 180 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: resolvedTheme === "dark" ? 1 : 0,
          opacity: resolvedTheme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon size={16} className="text-gray-700 dark:text-yellow-400 md:w-[18px] md:h-[18px]" />
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: resolvedTheme === "light" ? 1 : 0,
          opacity: resolvedTheme === "light" ? 1 : 0,
        }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="absolute"
      >
        <Sun size={16} className="text-orange-500 dark:text-yellow-400 md:w-[18px] md:h-[18px]" />
      </motion.div>
    </motion.button>
  )
}
