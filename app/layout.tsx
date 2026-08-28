import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n-context"
import { AnalyticsTracker } from "@/components/analytics-tracker"

export const metadata: Metadata = {
  title: "Triple Tres | AI Software Engineer · MCP Protocol · LLM Systems",
  description: "AI Software Engineer shipping production LLM systems: 43-tool MCP servers, 3-tier multi-agent orchestration with Claude API, and n8n automation for Mexican businesses.",
  generator: 'Triple Tres',
  applicationName: 'Triple Tres',
  keywords: ['MCP Protocol', 'Model Context Protocol', 'AI Software Engineer', 'LLM Orchestration', 'Multi-Agent Systems', 'Claude API', 'Anthropic', 'n8n', 'AI automation', 'agentic systems', 'CFDI', 'Mexican PyMEs', 'TypeScript', 'Next.js'],
  authors: [{ name: 'Triple Tres' }],
  icons: {
    icon: [
      { url: '/333_faviccon_for_light_themes.png', media: '(prefers-color-scheme: light)' },
      { url: '/333_faviccon_for_dark_themes.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
  openGraph: {
    title: 'Triple Tres | AI Software Engineer · MCP Protocol · LLM Systems',
    description: 'Building production MCP servers, 3-tier agentic orchestration, and AI-first SaaS for Mexican tax compliance',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a2eb1721-bfa8-40ef-b6e4-0a4605124678"
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange={false}>
          <I18nProvider>
            <AnalyticsTracker />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
