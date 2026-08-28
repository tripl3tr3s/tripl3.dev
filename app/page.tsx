import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Certifications from "@/components/certifications"
import Research from "@/components/research"
import Writing from "@/components/writing"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-gradient-to-b from-background to-background/90">
      <Header />
      <Hero />
      <Research />
      <Writing />
      <About />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  )
}
