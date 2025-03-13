import type React from "react"
import type { Metadata } from "next"
import { Anton, Poppins } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Bold, impactful font for the artist name
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
})

// Clean, modern font for body text (commonly used on music sites)
const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Max LaFarr",
  description: "Official website for Max LaFarr",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${poppins.variable} font-poppins`}>
        <Navbar />
        {children}
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
      </body>
    </html>
  )
}

