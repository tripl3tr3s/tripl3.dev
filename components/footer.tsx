"use client"

import { useTranslation } from "@/lib/use-translation"

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">&copy; {currentYear} Triple Tres · AI Systems Engineer. {t('footer.rights')}</p>
          </div>

          <div className="flex space-x-6">
            <a href="mailto:hola@tripl3.dev" className="text-gray-500 hover:text-green-400 transition-colors text-sm" data-umami-event="footer-email">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
