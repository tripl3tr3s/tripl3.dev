import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { getAllPostsMeta, getPostBySlug, formatPostDate } from "@/lib/writing"

export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | Triple Tres`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  }
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <article className="container mx-auto px-4 py-20 max-w-3xl">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          All writing
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-muted-foreground/60 mb-12">{formatPostDate(post.date)}</p>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.originalUrl && (
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View original post
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </article>
    </main>
  )
}
