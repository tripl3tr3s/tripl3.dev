import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"

const WRITING_DIR = path.join(process.cwd(), "content", "writing")

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "id"],
    // defaultSchema allows `type`/`disabled` on <input> for GFM task lists but drops `checked`,
    // which would silently un-check every completed checklist item.
    input: [...(defaultSchema.attributes?.input ?? []), "checked"],
  },
}

export interface WritingPostMeta {
  slug: string
  title: string
  excerpt: string
  /**
   * Full ISO 8601 timestamp with UTC offset, e.g. "2026-07-17T16:27:00-06:00".
   * Optional in frontmatter: omit it and it's derived automatically from the git commit
   * that first added the post file (see `getGitFirstCommitDate`). Set it explicitly only to
   * override that - e.g. the migrated posts, whose real publish date predates this repo.
   */
  date: string
  tags: string[]
  originalUrl?: string
  originalLanguage?: string
  draft?: boolean
}

export interface WritingPost extends WritingPostMeta {
  html: string
}

function readSlugs(): string[] {
  return fs
    .readdirSync(WRITING_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
}

function readPostFile(slug: string) {
  const filePath = path.join(WRITING_DIR, `${slug}.md`)
  const raw = fs.readFileSync(filePath, "utf8")
  return matter(raw)
}

/**
 * The ISO 8601 timestamp of the commit that first added `filePath` to git history, or `null`
 * if the file isn't committed yet (new/uncommitted draft) or git isn't available.
 */
export function getGitFirstCommitDate(filePath: string): string | null {
  const relPath = path.relative(process.cwd(), filePath)
  try {
    const out = execFileSync("git", ["log", "--diff-filter=A", "--follow", "--format=%aI", "--", relPath], {
      encoding: "utf8",
    }).trim()
    if (!out) return null
    const dates = out.split("\n").filter(Boolean)
    return dates[dates.length - 1] ?? null
  } catch {
    return null
  }
}

function resolveDate(slug: string, frontmatterDate: unknown): string {
  if (typeof frontmatterDate === "string" && frontmatterDate.trim() !== "") return frontmatterDate
  const filePath = path.join(WRITING_DIR, `${slug}.md`)
  return getGitFirstCommitDate(filePath) ?? new Date().toISOString()
}

function toMeta(slug: string, data: Record<string, unknown>): WritingPostMeta {
  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    date: resolveDate(slug, data.date),
    tags: (data.tags as string[]) ?? [],
    originalUrl: data.originalUrl as string | undefined,
    originalLanguage: data.originalLanguage as string | undefined,
    draft: (data.draft as boolean) ?? false,
  }
}

// With `output: "export"`, every dynamic route must be covered by generateStaticParams,
// even under `next dev` - there's no on-demand fallback rendering to lean on. `next build`
// always forces NODE_ENV=production (regardless of the shell env), and `next dev` always
// forces NODE_ENV=development, so this is how drafts stay previewable locally without ever
// getting a generated route (and therefore a live URL) in the production export.
const INCLUDE_DRAFTS = process.env.NODE_ENV !== "production"

export function getAllPostsMeta(): WritingPostMeta[] {
  return readSlugs()
    .map((slug) => toMeta(slug, readPostFile(slug).data))
    .filter((post) => INCLUDE_DRAFTS || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPostBySlug(slug: string): Promise<WritingPost | null> {
  if (!readSlugs().includes(slug)) return null

  const { data, content } = readPostFile(slug)
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(content)

  return {
    ...toMeta(slug, data),
    html: processed.toString(),
  }
}

export function formatPostDate(isoDateTime: string): string {
  const parsed = new Date(isoDateTime)
  if (Number.isNaN(parsed.getTime())) return isoDateTime
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Mexico_City",
  })
}
