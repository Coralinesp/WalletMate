import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutClient } from "@/components/LayoutClient" // 👈 importa el nuevo componente

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WalletMate",
  description: "Gestiona tus finanzas personales de manera eficiente",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
