import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entropy Collapse & Top-p Sampling",
  robots: {
    index: false,
    follow: false,
  },
}

export default function EntropyCollapsePage() {
  return (
    <iframe
      src="/entropy-collapse/index.html"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 9999,
      }}
      title="Entropy Collapse & Top-p Sampling"
    />
  )
}
