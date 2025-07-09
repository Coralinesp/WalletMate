"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import logo from "../public/WalletMate.png"
import { cn } from "@/lib/utils"
import {
  Home,
  TrendingUp,
  TrendingDown,
  List,
  CreditCard,
  Users,
  LogOut,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Tipos de Ingresos", href: "/tipos-ingresos", icon: TrendingUp },
  { name: "Tipos de Egresos", href: "/tipos-egresos", icon: TrendingDown },
  { name: "Renglones", href: "/renglones", icon: List },
  { name: "Tipos de Pago", href: "/tipos-pago", icon: CreditCard },
  { name: "Ingresos", href: "/ingresos", icon: TrendingUp },
  { name: "Egresos", href: "/egresos", icon: TrendingDown },
  { name: "Usuarios", href: "/usuarios", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  // Inicializa y escucha cambios de sesión
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
    }

    checkLogin()

    // 🔁 Escucha los cambios de sesión emitidos por login/logout
    window.addEventListener("loginStatusChanged", checkLogin)

    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("usuario")
    window.dispatchEvent(new Event("loginStatusChanged"))
    router.push("/")
  }

  if (isLoggedIn === null) return null

  const filteredNavigation = isLoggedIn
    ? navigation.filter((item) => item.name !== "Dashboard") // Oculta Dashboard si ya inició sesión
    : navigation.filter((item) => item.name === "Dashboard") // Solo muestra Dashboard si no ha iniciado

  return (
    <div className="bg-white w-64 shadow-lg border-r border-r-gray-200 min-h-screen flex flex-col justify-between">
      <div>
       <div className="py-4 px-6">
          <Image src={logo} alt="WalletMate logo" width={180} height={50} />
        </div>
        <nav className="mt-6">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {isLoggedIn && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
