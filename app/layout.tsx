import type { Metadata } from "next"
import "./globals.css"

// ✅ IMPORTANT:
// These paths must match your actual folder structure.
// From your screenshots, these files EXIST:
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Home2Work Cleaning | Professional Cleaning Services",
  description:
    "Professional residential and commercial cleaning services. Book online with Home2Work Cleaning.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  )
}
