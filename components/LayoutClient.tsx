"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [showLayout, setShowLayout] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Oculta sidebar y header solo en "/"
      const isLogin = pathname === "/"
      setShowLayout(!isLogin)
    }
  }, [pathname, mounted])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-gray-100">
      {showLayout && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showLayout && <Header />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
