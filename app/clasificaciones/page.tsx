"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Clasificacion {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
}

export default function Clasificaciones() {
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([
    { id: 1, nombre: "Comida", descripcion: "Gastos en alimentación y restaurantes", activo: true },
    { id: 2, nombre: "Combustible", descripcion: "Gastos en gasolina y transporte", activo: true },
    { id: 3, nombre: "Recreación", descripcion: "Entretenimiento y actividades recreativas", activo: true },
    { id: 4, nombre: "Servicios", descripcion: "Servicios públicos y suscripciones", activo: true },
    { id: 5, nombre: "Salud", descripcion: "Gastos médicos y farmacéuticos", activo: true },
    { id: 6, nombre: "Educación", descripcion: "Gastos educativos y capacitación", activo: true },
    { id: 7, nombre: "Ropa", descripcion: "Vestimenta y accesorios", activo: true },
    { id: 8, nombre: "Hogar", descripcion: "Gastos del hogar y mantenimiento", activo: true },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClasificacion, setEditingClasificacion] = useState<Clasificacion | null>(null)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClasificacion) {
      setClasificaciones((prev) =>
        prev.map((clasificacion) =>
          clasificacion.id === editingClasificacion.id
            ? { ...clasificacion, nombre: formData.nombre, descripcion: formData.descripcion }
            : clasificacion,
        ),
      )
    } else {
      const newClasificacion: Clasificacion = {
        id: Math.max(...clasificaciones.map((c) => c.id)) + 1,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        activo: true,
      }
      setClasificaciones((prev) => [...prev, newClasificacion])
    }
    setIsDialogOpen(false)
    setEditingClasificacion(null)
    setFormData({ nombre: "", descripcion: "" })
  }

  const handleEdit = (clasificacion: Clasificacion) => {
    setEditingClasificacion(clasificacion)
    setFormData({ nombre: clasificacion.nombre, descripcion: clasificacion.descripcion })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setClasificaciones((prev) => prev.filter((clasificacion) => clasificacion.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clasificaciones de Egresos</h1>
          <p className="text-muted-foreground">Gestiona las clasificaciones para categorizar los egresos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingClasificacion(null)
                setFormData({ nombre: "", descripcion: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Clasificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClasificacion ? "Editar Clasificación" : "Nueva Clasificación"}</DialogTitle>
              <DialogDescription>
                {editingClasificacion
                  ? "Modifica los datos de la clasificación"
                  : "Crea una nueva clasificación de egresos"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Comida"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Describe la clasificación..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingClasificacion ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clasificaciones</CardTitle>
          <CardDescription>{clasificaciones.length} clasificaciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clasificaciones.map((clasificacion) => (
                <TableRow key={clasificacion.id}>
                  <TableCell className="font-medium">{clasificacion.id}</TableCell>
                  <TableCell>{clasificacion.nombre}</TableCell>
                  <TableCell>{clasificacion.descripcion}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        clasificacion.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {clasificacion.activo ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(clasificacion)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(clasificacion.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
