import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ScaffoldMoveAppWithProviders } from "~~/components/ScaffoldMoveAppWithProviders";
import { ThemeProvider } from "~~/components/theme-provider"
import { Toaster } from "~~/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "Buy, sell, and trade unique digital assets",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ScaffoldMoveAppWithProviders>
            <Toaster />
            {children}
          </ScaffoldMoveAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'