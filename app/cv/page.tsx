export const metadata = {
  title: "Ricardo Jaimes - CV",
}

export default function CVPage() {
  return (
    <iframe
      src="/cv/index.html"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 9999,
      }}
      title="Ricardo Jaimes - CV"
    />
  )
}
