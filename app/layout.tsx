import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})
// Définition des métadonnées de l'application, utilisées par Next.js pour le SEO
export const metadata: Metadata = {
  title: 'Eventail',
  description: 'Eventail est une plateforme de management d"évenement.',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={poppins.variable}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
