import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { PackProvider } from "@/contexts/pack-context"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import { SalesSlides } from "@/components/sales-slides"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ventas CRM",
  description: "Parse CSV files and extract phone numbers with InfoExperto integration",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.className}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <PackProvider>
              <Navigation />
              {children}
              <SalesSlides />
            </PackProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
