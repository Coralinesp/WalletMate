"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, PieChart, BarChart3 } from "lucide-react"

export default function Reportes() {
  const [filtros, setFiltros] = useState({
    fechaInicio: "2024-01-01",
    fechaFin: "2024-01-31",
    usuario: "",
    tipoReporte: "resumen",
  })

  const datosReporte = {
    resumen: {
      totalIngresos: 5650.0,
      totalEgresos: 3456.25,
      balance: 2193.75,
      transacciones: 45,
    },
    ingresosPorTipo: [
      { tipo: "Salario Base", monto: 5000.0, porcentaje: 88.5 },
      { tipo: "Comisiones", monto: 450.0, porcentaje: 8.0 },
      { tipo: "Horas Extras", monto: 200.0, porcentaje: 3.5 },
    ],
    egresosPorClasificacion: [
      { clasificacion: "Comida", monto: 1250.0, porcentaje: 36.2 },
      { clasificacion: "Combustible", monto: 680.0, porcentaje: 19.7 },
      { clasificacion: "Recreación", monto: 520.0, porcentaje: 15.0 },
      { clasificacion: "Servicios", monto: 450.0, porcentaje: 13.0 },
      { clasificacion: "Salud", monto: 356.25, porcentaje: 10.3 },
      { clasificacion: "Otros", monto: 200.0, porcentaje: 5.8 },
    ],
    transaccionesPorMes: [{ mes: "Enero", ingresos: 5650.0, egresos: 3456.25, balance: 2193.75 }],
  }

  const generarReporte = () => {
    // Aquí se implementaría la lógica para generar el reporte
    console.log("Generando reporte con filtros:", filtros)
  }

  const exportarReporte = (formato: string) => {
    // Aquí se implementaría la lógica para exportar el reporte
    console.log(`Exportando reporte en formato ${formato}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes Financieros</h1>
          <p className="text-muted-foreground">Genera reportes detallados de tu situación financiera</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportarReporte("PDF")}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportarReporte("Excel")}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filtros de Reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Reporte</CardTitle>
          <CardDescription>Selecciona los parámetros para generar tu reporte personalizado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select
                value={filtros.tipoReporte}
                onValueChange={(value) => setFiltros((prev) => ({ ...prev, tipoReporte: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resumen">Resumen General</SelectItem>
                  <SelectItem value="ingresos">Análisis de Ingresos</SelectItem>
                  <SelectItem value="egresos">Análisis de Egresos</SelectItem>
                  <SelectItem value="comparativo">Comparativo Mensual</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label>Usuario</Label>
              <Select
                value={filtros.usuario}
                onValueChange={(value) => setFiltros((prev) => ({ ...prev, usuario: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los usuarios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  <SelectItem value="juan">Juan Pérez</SelectItem>
                  <SelectItem value="maria">María García</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={generarReporte}>
              <FileText className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Ejecutivo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${datosReporte.resumen.totalIngresos.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Período seleccionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${datosReporte.resumen.totalEgresos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Período seleccionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
            <PieChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${datosReporte.resumen.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ahorro del período</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{datosReporte.resumen.transacciones}</div>
            <p className="text-xs text-muted-foreground">Total de movimientos</p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Ingresos */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Ingresos por Tipo</CardTitle>
          <CardDescription>Distribución de ingresos por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Ingreso</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Porcentaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosReporte.ingresosPorTipo.map((ingreso, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ingreso.tipo}</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    ${ingreso.monto.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{ingreso.porcentaje}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Análisis de Egresos */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Egresos por Clasificación</CardTitle>
          <CardDescription>Distribución de gastos por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clasificación</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Porcentaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosReporte.egresosPorClasificacion.map((egreso, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{egreso.clasificacion}</TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    ${egreso.monto.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{egreso.porcentaje}%</Badge>
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
