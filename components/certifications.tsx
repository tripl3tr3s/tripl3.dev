"use client"

import React from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { ExternalLink, Download, X, Brain, Code2, Database, Workflow } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"

// Certificate data structure
interface Certificate {
  id: string
  title: string
  date: string
  hours?: string
  platform: "Platzi" | "Anthropic" | "DataCamp" | "n8n"
  category: "AI" | "Development" | "Logic" | "Blockchain" | "Tools" | "Data" | "Automation"
  file: string
  verifyUrl?: string
  description?: string
  featured?: boolean
}

// Selected highlights. Full credential history lives on LinkedIn.
const certificates: Certificate[] = [
  {
    id: "mcp-advanced",
    title: "Model Context Protocol: Advanced Topics",
    date: "October 7, 2025",
    platform: "Anthropic",
    category: "AI",
    file: "certificate-outzbe498ykm-AdvancedMCP.pdf",
    verifyUrl: "https://verify.skilljar.com/c/outzbe498ykm",
    featured: true,
  },
  {
    id: "claude-code",
    title: "Claude Code in Action",
    date: "September 25, 2025",
    platform: "Anthropic",
    category: "AI",
    file: "certificate-9reqrkwostz5-1758848937.pdf",
    verifyUrl: "https://verify.skilljar.com/c/9reqrkwostz5",
  },
  {
    id: "scalable-agents",
    title: "Building Scalable Agentic Systems",
    date: "2025",
    platform: "DataCamp",
    category: "AI",
    file: "building_scalable_agentic_systems.pdf",
    description: "Architecture patterns for scalable multi-agent systems",
  },
  {
    id: "n8n-selfhosted",
    title: "n8n Self-Hosted for Enterprises",
    date: "November 2025",
    platform: "n8n",
    category: "Automation",
    file: "diploma-n8n-selfhosted.pdf",
    description: "Enterprise-level n8n deployment and self-hosted infrastructure management",
  },
]

// Platform colors
const platformColors = {
  Platzi: { primary: "hsl(88, 60%, 50%)", glow: "rgba(152, 202, 63, 0.3)" },
  Anthropic: { primary: "hsl(45, 30%, 50%)", glow: "rgba(204, 179, 128, 0.3)" },
  DataCamp: { primary: "hsl(180, 60%, 50%)", glow: "rgba(58, 196, 201, 0.3)" },
  n8n: { primary: "hsl(11, 100%, 67%)", glow: "rgba(255, 109, 90, 0.3)" }
}

// Category icons
const categoryIcons = {
  AI: Brain,
  Development: Code2,
  Logic: Code2,
  Blockchain: Database,
  Tools: Code2,
  Data: Database,
  Automation: Workflow
}

// Category colors for visual grouping
const categoryColors = {
  AI: {
    border: "border-purple-500/30",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    hover: "hover:border-purple-500/50",
    bg: "bg-purple-500/5"
  },
  Automation: {
    border: "border-orange-500/30",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    hover: "hover:border-orange-500/50",
    bg: "bg-orange-500/5"
  },
  Development: {
    border: "border-green-500/30",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
    hover: "hover:border-green-500/50",
    bg: "bg-green-500/5"
  },
  Logic: {
    border: "border-blue-500/30",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    hover: "hover:border-blue-500/50",
    bg: "bg-blue-500/5"
  },
  Blockchain: {
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    hover: "hover:border-cyan-500/50",
    bg: "bg-cyan-500/5"
  },
  Tools: {
    border: "border-yellow-500/30",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
    hover: "hover:border-yellow-500/50",
    bg: "bg-yellow-500/5"
  },
  Data: {
    border: "border-pink-500/30",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]",
    hover: "hover:border-pink-500/50",
    bg: "bg-pink-500/5"
  }
}

interface CertificateCardProps {
  cert: Certificate
  index: number
  onClick: () => void
  t: (key: string) => string
}

function CertificateCard({ cert, index, onClick, t }: CertificateCardProps) {
  const Icon = categoryIcons[cert.category]
  const color = platformColors[cert.platform]
  const categoryColor = categoryColors[cert.category]

  return (
    <motion.div
      className={`bg-card/30 p-6 rounded-xl border ${categoryColor.border} ${categoryColor.hover} ${categoryColor.glow} transition-all group cursor-pointer relative overflow-hidden ${categoryColor.bg}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 20
        }
      }}
      onClick={onClick}
    >
      {/* Hover gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color.glow}, transparent)`
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="p-3 bg-muted rounded-lg inline-block mb-4 group-hover:bg-green-500/10 transition-colors"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-6 h-6" style={{ color: color.primary }} />
        </motion.div>

        {/* Title */}
        <h4 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
          {cert.title}
        </h4>

        {/* Platform badge */}
        <div className="inline-block px-2 py-1 rounded text-xs font-semibold mb-2"
          style={{
            backgroundColor: color.glow,
            color: color.primary
          }}
        >
          {cert.platform}
        </div>

        {/* Date and hours */}
        <p className="text-muted-foreground text-sm mb-3">
          {cert.date} {cert.hours && `• ${cert.hours}`}
        </p>

        {/* Action */}
        <div className="flex items-center gap-2 text-sm">
          <motion.span
            className="inline-flex items-center text-green-700 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 font-medium"
            data-umami-event={`cert-ver-${cert.id}`}
          >
            {t('certifications.viewCert')} <ExternalLink className="ml-1 w-3 h-3" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

const featuredStyle: Record<string, {
  gradient: string; border: string; glow: string; text: string; button: string; iconBg: string; icon: React.ReactNode
}> = {
  n8n: {
    gradient: "from-orange-500/10 via-red-500/10 to-pink-500/10",
    border: "border-orange-500/30",
    glow: "from-orange-500/20 to-pink-500/20",
    text: "text-orange-500",
    button: "from-orange-500 to-red-500",
    iconBg: "bg-orange-500/20",
    icon: <Workflow className="w-16 h-16 text-orange-500" />,
  },
  Anthropic: {
    gradient: "from-amber-500/10 via-yellow-600/10 to-orange-400/10",
    border: "border-amber-500/30",
    glow: "from-amber-500/20 to-yellow-500/20",
    text: "text-amber-400",
    button: "from-amber-500 to-yellow-500",
    iconBg: "bg-amber-500/20",
    icon: <Brain className="w-16 h-16 text-amber-400" />,
  },
}

function FeaturedCard({ cert, onSelect, t }: {
  cert: Certificate
  onSelect: (cert: Certificate) => void
  t: (key: string) => string
}) {
  const style = featuredStyle[cert.platform] ?? featuredStyle.n8n

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border-2 ${style.border} cursor-pointer group`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(cert)}
      style={{ minHeight: "180px" }}
    >
      <div className={`bg-gradient-to-br ${style.gradient} p-8`}>
        {/* Ribbon */}
        <div className={`absolute top-6 -right-12 bg-gradient-to-r ${style.button} text-white px-12 py-2 rotate-45 text-sm font-bold shadow-lg`}>
          {t('certifications.featured').split(' ')[0]}
        </div>

        {/* Pulse glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${style.glow} pointer-events-none`}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <motion.div
            className={`p-6 ${style.iconBg} rounded-2xl shrink-0`}
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {style.icon}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <div className={`${style.text} font-bold text-sm mb-2`}>🏆 {t('certifications.featured')}</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{cert.title}</h3>
            <p className="text-muted-foreground mb-4">
              {cert.platform} • {cert.date}
            </p>
            <motion.button
              className={`px-6 py-2 bg-gradient-to-r ${style.button} text-white rounded-lg font-semibold hover:shadow-lg transition-shadow`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={e => { e.stopPropagation(); onSelect(cert) }}
              data-umami-event={`cert-destacada-${cert.id}`}
            >
              {t('certifications.viewBadge')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CertificateModal({ cert, onClose, t }: { cert: Certificate; onClose: () => void; t: (key: string) => string }) {
  const isImage = cert.file.endsWith('.webp') || cert.file.endsWith('.png') || cert.file.endsWith('.jpg')

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden relative"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{cert.title}</h3>
            <p className="text-sm text-muted-foreground">{cert.platform} • {cert.date}</p>
          </div>
          <div className="flex items-center gap-2">
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Verify Certificate"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            <a
              href={`/${cert.file}`}
              download
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/${cert.file}`}
              alt={cert.title}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <iframe
              src={`/${cert.file}`}
              className="w-full h-[600px] rounded-lg"
              title={cert.title}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Certifications() {
  const { t } = useTranslation()
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  const featuredCert = certificates.find(c => c.featured) ?? certificates[0]
  const otherCerts = certificates.filter(c => c.id !== featuredCert.id)

  return (
    <>
      <section id="certifications" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('certifications.title')}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-cyan-500 mx-auto mb-8"></div>
            <p className="text-muted-foreground text-lg">
              {t('certifications.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Featured certification */}
            <FeaturedCard cert={featuredCert} onSelect={setSelectedCert} t={t} />

            {/* Other certifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCerts.map((cert, idx) => (
                <CertificateCard
                  key={cert.id}
                  cert={cert}
                  index={idx}
                  onClick={() => setSelectedCert(cert)}
                  t={t}
                />
              ))}
            </div>

            {/* Full history link */}
            <div className="text-center pt-2">
              <a
                href="https://www.linkedin.com/in/tripl3tr3s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 font-medium transition-colors"
                data-umami-event="cert-linkedin-history"
              >
                {t('certifications.fullHistory')} <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedCert && (
        <CertificateModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
          t={t}
        />
      )}
    </>
  )
}
