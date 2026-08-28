import { translations } from "./translations"

export function useTranslation() {
  const t = (path: string): string => {
    const keys = path.split('.')
    let value: unknown = translations

    for (const key of keys) {
      if (typeof value !== "object" || value === null || !(key in value)) return path
      value = (value as Record<string, unknown>)[key]
    }

    return typeof value === 'string' ? value : path
  }

  return { t }
}
