import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ViewTransition } from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CoffeeMe - Coordinate Coffee Runs",
  description: "Coordinate coffee runs with your team using probability-based assignment",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  )
}
