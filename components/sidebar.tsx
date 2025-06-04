"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, TrendingUp, TrendingDown, Tags, CreditCard, Users, FileText, PieChart, Calendar } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Tipos de Ingresos", href: "/tipos-ingresos", icon: TrendingUp },
  { name: "Tipos de Egresos", href: "/tipos-egresos", icon: TrendingDown },
  { name: "Clasificaciones", href: "/clasificaciones", icon: Tags },
  { name: "Tipos de Pago", href: "/tipos-pago", icon: CreditCard },
  { name: "Ingresos", href: "/ingresos", icon: TrendingUp },
  { name: "Egresos", href: "/egresos", icon: TrendingDown },
  { name: "Usuarios", href: "/usuarios", icon: Users },
  { name: "Transacciones", href: "/transacciones", icon: FileText },
  { name: "Reportes", href: "/reportes", icon: PieChart },
  { name: "Corte Mensual", href: "/corte-mensual", icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white w-64 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">FinanceApp</h2>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
