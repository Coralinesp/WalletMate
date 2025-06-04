"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface CorteMensual {
  id: number
  mes: string
  año: number
  fechaCorte: string
  estado: "Pendiente" | "En Proceso" | "Completado"
  totalIngresos: number
  totalEgresos: number
  balance: number
  transacciones: number
}

export default function CorteMensual() {
  const [cortes, setCortes] = useState<CorteMensual[]>([
    {
      id: 1,
      mes: "Enero",
      año: 2024,
      fechaCorte: "2024-01-31",
      estado: "Completado",
      totalIngresos: 5650.0,
      totalEgresos: 3456.25,
      balance: 2193.75,
      transacciones: 45,
    },
    {
      id: 2,
      mes: "Febrero",
      año: 2024,
      fechaCorte: "2024-02-29",
      estado: "En Proceso",
      totalIngresos: 4200.0,
      totalEgresos: 2800.5,
      balance: 1399.5,
      transacciones: 32,
    },
    {
      id: 3,
      mes: "Marzo",
      año: 2024,
      fechaCorte: "2024-03-31",
      estado: "Pendiente",
      totalIngresos: 0,
      totalEgresos: 0,
      balance: 0,
      transacciones: 0,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [procesoCorte, setProcesoCorte] = useState({
    mes: "",
    año: new Date().getFullYear(),
    fechaCorte: "",
  })

  const ejecutarCorte = (id: number) => {
    setCortes((prev) => prev.map((corte) => (corte.id === id ? { ...corte, estado: "Completado" as const } : corte)))
  }

  const iniciarNuevoCorte = () => {
    const nuevoCorte: CorteMensual = {
      id: Math.max(...cortes.map((c) => c.id)) + 1,
      mes: procesoCorte.mes,
      año: procesoCorte.año,
      fechaCorte: procesoCorte.fechaCorte,
      estado: "En Proceso",
      totalIngresos: 0,
      totalEgresos: 0,
      balance: 0,
      transacciones: 0,
    }
    setCortes((prev) => [...prev, nuevoCorte])
    setIsDialogOpen(false)
    setProcesoCorte({ mes: "", año: new Date().getFullYear(), fechaCorte: "" })
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Completado":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "En Proceso":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Pendiente":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "En Proceso":
        return "bg-yellow-100 text-yellow-800"
      case "Pendiente":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Corte Mensual</h1>
          <p className="text-muted-foreground">Gestiona los procesos de corte mensual y cierre de períodos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Nuevo Corte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Iniciar Nuevo Corte Mensual</DialogTitle>
              <DialogDescription>Configura los parámetros para el nuevo proceso de corte</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Mes</Label>
                <Select
                  value={procesoCorte.mes}
                  onValueChange={(value) => setProcesoCorte((prev) => ({ ...prev, mes: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el mes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enero">Enero</SelectItem>
                    <SelectItem value="Febrero">Febrero</SelectItem>
                    <SelectItem value="Marzo">Marzo</SelectItem>
                    <SelectItem value="Abril">Abril</SelectItem>
                    <SelectItem value="Mayo">Mayo</SelectItem>
                    <SelectItem value="Junio">Junio</SelectItem>
                    <SelectItem value="Julio">Julio</SelectItem>
                    <SelectItem value="Agosto">Agosto</SelectItem>
                    <SelectItem value="Septiembre">Septiembre</SelectItem>
                    <SelectItem value="Octubre">Octubre</SelectItem>
                    <SelectItem value="Noviembre">Noviembre</SelectItem>
                    <SelectItem value="Diciembre">Diciembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Año</Label>
                <Input
                  type="number"
                  value={procesoCorte.año}
                  onChange={(e) => setProcesoCorte((prev) => ({ ...prev, año: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de Corte</Label>
                <Input
                  type="date"
                  value={procesoCorte.fechaCorte}
                  onChange={(e) => setProcesoCorte((prev) => ({ ...prev, fechaCorte: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={iniciarNuevoCorte}>Iniciar Corte</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen de Cortes */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cortes Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cortes.filter((c) => c.estado === "Completado").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cortes.filter((c) => c.estado === "En Proceso").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cortes.filter((c) => c.estado === "Pendiente").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cortes */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cortes Mensuales</CardTitle>
          <CardDescription>Lista de todos los procesos de corte realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Fecha Corte</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
                <TableHead className="text-right">Egresos</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Transacciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cortes.map((corte) => (
                <TableRow key={corte.id}>
                  <TableCell className="font-medium">
                    {corte.mes} {corte.año}
                  </TableCell>
                  <TableCell>{corte.fechaCorte}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEstadoIcon(corte.estado)}
                      <Badge className={getEstadoColor(corte.estado)}>{corte.estado}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    ${corte.totalIngresos.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    ${corte.totalEgresos.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${corte.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${corte.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{corte.transacciones}</TableCell>
                  <TableCell className="text-right">
                    {corte.estado === "En Proceso" && (
                      <Button size="sm" onClick={() => ejecutarCorte(corte.id)}>
                        Completar
                      </Button>
                    )}
                    {corte.estado === "Completado" && (
                      <Button variant="outline" size="sm">
                        Ver Detalle
                      </Button>
                    )}
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
