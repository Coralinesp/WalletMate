"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart, FileText } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Ingresos del Mes",
      value: "$45,231.89",
      change: "+20.1%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Egresos del Mes",
      value: "$32,405.67",
      change: "-4.3%",
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      title: "Balance Actual",
      value: "$12,826.22",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Transacciones",
      value: "234",
      change: "+7.2%",
      icon: CreditCard,
      color: "text-purple-600",
    },
  ]

  const quickActions = [
    { title: "Registrar Ingreso", href: "/ingresos/nuevo", icon: TrendingUp },
    { title: "Registrar Egreso", href: "/egresos/nuevo", icon: TrendingDown },
    { title: "Ver Transacciones", href: "/transacciones", icon: FileText },
    { title: "Generar Reporte", href: "/reportes", icon: PieChart },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Financiero</h1>
        <p className="text-muted-foreground">Resumen de tu situación financiera actual</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.color}>{stat.change}</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm">{action.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimas 5 transacciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { tipo: "Ingreso", descripcion: "Salario Base Unapec", monto: "+$2,500.00", fecha: "2024-01-15" },
              { tipo: "Egreso", descripcion: "Compra Supermercado", monto: "-$125.50", fecha: "2024-01-14" },
              { tipo: "Egreso", descripcion: "Recarga Combustible", monto: "-$45.00", fecha: "2024-01-13" },
              { tipo: "Ingreso", descripcion: "Comisión Consultora", monto: "+$300.00", fecha: "2024-01-12" },
              { tipo: "Egreso", descripcion: "Cena Restaurante", monto: "-$85.75", fecha: "2024-01-11" },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{transaction.descripcion}</p>
                  <p className="text-sm text-muted-foreground">{transaction.fecha}</p>
                </div>
                <div className={`font-medium ${transaction.tipo === "Ingreso" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.monto}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
