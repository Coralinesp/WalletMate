"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download } from "lucide-react"

interface Transaccion {
  id: number
  fecha: string
  tipo: "Ingreso" | "Egreso"
  descripcion: string
  monto: number
  usuario: string
  tipoTransaccion: string
  clasificacion?: string
  tipoPago: string
}

export default function Transacciones() {
  const [transacciones] = useState<Transaccion[]>([
    {
      id: 1,
      fecha: "2024-01-15",
      tipo: "Ingreso",
      descripcion: "Salario Base Unapec",
      monto: 2500.0,
      usuario: "Juan Pérez",
      tipoTransaccion: "Salario Base",
      tipoPago: "Transferencia",
    },
    {
      id: 2,
      fecha: "2024-01-14",
      tipo: "Egreso",
      descripcion: "Compra Supermercado Nacional",
      monto: 125.5,
      usuario: "Juan Pérez",
      tipoTransaccion: "Gasto",
      clasificacion: "Comida",
      tipoPago: "Tarjeta de Débito",
    },
    {
      id: 3,
      fecha: "2024-01-13",
      tipo: "Egreso",
      descripcion: "Recarga Combustible Shell",
      monto: 45.0,
      usuario: "Juan Pérez",
      tipoTransaccion: "Gasto",
      clasificacion: "Combustible",
      tipoPago: "Efectivo",
    },
    {
      id: 4,
      fecha: "2024-01-12",
      tipo: "Ingreso",
      descripcion: "Comisión Consultora AXP",
      monto: 300.0,
      usuario: "Juan Pérez",
      tipoTransaccion: "Comisiones",
      tipoPago: "Transferencia",
    },
    {
      id: 5,
      fecha: "2024-01-11",
      tipo: "Egreso",
      descripcion: "Cena Restaurante Vesuvio",
      monto: 85.75,
      usuario: "María García",
      tipoTransaccion: "Gasto",
      clasificacion: "Recreación",
      tipoPago: "Tarjeta de Crédito",
    },
  ])

  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipo: "Todos los tipos",
    usuario: "",
    fechaInicio: "",
    fechaFin: "",
  })

  const transaccionesFiltradas = transacciones.filter((transaccion) => {
    return (
      transaccion.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase()) &&
      (filtros.tipo === "Todos los tipos" || transaccion.tipo === filtros.tipo) &&
      (filtros.usuario === "" || transaccion.usuario.includes(filtros.usuario))
    )
  })

  const totalIngresos = transaccionesFiltradas.filter((t) => t.tipo === "Ingreso").reduce((sum, t) => sum + t.monto, 0)

  const totalEgresos = transaccionesFiltradas.filter((t) => t.tipo === "Egreso").reduce((sum, t) => sum + t.monto, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transacciones</h1>
          <p className="text-muted-foreground">Consulta y filtra todas las transacciones del sistema</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIngresos.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalEgresos.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalIngresos - totalEgresos >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${(totalIngresos - totalEgresos).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Buscar transacciones..."
                  className="pl-8"
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros((prev) => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos los tipos">Todos los tipos</SelectItem>
                  <SelectItem value="Ingreso">Ingreso</SelectItem>
                  <SelectItem value="Egreso">Egreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Usuario</Label>
              <Input
                placeholder="Filtrar por usuario"
                value={filtros.usuario}
                onChange={(e) => setFiltros((prev) => ({ ...prev, usuario: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros((prev) => ({ ...prev, fechaInicio: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros((prev) => ({ ...prev, fechaFin: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
          <CardDescription>{transaccionesFiltradas.length} transacciones encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead>Tipo Pago</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaccionesFiltradas.map((transaccion) => (
                <TableRow key={transaccion.id}>
                  <TableCell className="font-medium">{transaccion.id}</TableCell>
                  <TableCell>{transaccion.fecha}</TableCell>
                  <TableCell>
                    <Badge variant={transaccion.tipo === "Ingreso" ? "default" : "destructive"}>
                      {transaccion.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaccion.descripcion}</TableCell>
                  <TableCell>{transaccion.usuario}</TableCell>
                  <TableCell>
                    {transaccion.clasificacion && <Badge variant="outline">{transaccion.clasificacion}</Badge>}
                  </TableCell>
                  <TableCell>{transaccion.tipoPago}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaccion.tipo === "Ingreso" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaccion.tipo === "Ingreso" ? "+" : "-"}${transaccion.monto.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
