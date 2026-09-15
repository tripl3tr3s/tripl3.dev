import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { getAllPostsMeta, formatPostDate } from "@/lib/writing"

export const metadata: Metadata = {
  title: "Writing | Triple Tres",
  description: "What I actually build: the non-obvious problems, the design decisions, and what breaks in production.",
}

export default function WritingIndexPage() {
  const posts = getAllPostsMeta()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Writing</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-cyan-500 mb-12" />

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="block rounded-2xl border border-border bg-card/30 p-6 hover:border-green-500/30 hover:bg-green-500/5 transition-colors"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold mb-2 text-foreground">{post.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{post.excerpt}</p>
              <span className="text-xs text-muted-foreground/60">{formatPostDate(post.date)}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
