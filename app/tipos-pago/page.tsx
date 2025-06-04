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

interface TipoPago {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
}

export default function TiposPago() {
  const [tiposPago, setTiposPago] = useState<TipoPago[]>([
    { id: 1, nombre: "Efectivo", descripcion: "Pago en dinero en efectivo", activo: true },
    { id: 2, nombre: "Tarjeta de Débito", descripcion: "Pago con tarjeta de débito", activo: true },
    { id: 3, nombre: "Tarjeta de Crédito", descripcion: "Pago con tarjeta de crédito", activo: true },
    { id: 4, nombre: "Cheque", descripcion: "Pago mediante cheque", activo: true },
    { id: 5, nombre: "Transferencia", descripcion: "Transferencia bancaria", activo: true },
    { id: 6, nombre: "PayPal", descripcion: "Pago a través de PayPal", activo: true },
    { id: 7, nombre: "Criptomonedas", descripcion: "Pago con criptomonedas", activo: true },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState<TipoPago | null>(null)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTipo) {
      setTiposPago((prev) =>
        prev.map((tipo) =>
          tipo.id === editingTipo.id ? { ...tipo, nombre: formData.nombre, descripcion: formData.descripcion } : tipo,
        ),
      )
    } else {
      const newTipo: TipoPago = {
        id: Math.max(...tiposPago.map((t) => t.id)) + 1,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        activo: true,
      }
      setTiposPago((prev) => [...prev, newTipo])
    }
    setIsDialogOpen(false)
    setEditingTipo(null)
    setFormData({ nombre: "", descripcion: "" })
  }

  const handleEdit = (tipo: TipoPago) => {
    setEditingTipo(tipo)
    setFormData({ nombre: tipo.nombre, descripcion: tipo.descripcion })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setTiposPago((prev) => prev.filter((tipo) => tipo.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Pago</h1>
          <p className="text-muted-foreground">Gestiona los diferentes métodos de pago disponibles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTipo(null)
                setFormData({ nombre: "", descripcion: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTipo ? "Editar Tipo de Pago" : "Nuevo Tipo de Pago"}</DialogTitle>
              <DialogDescription>
                {editingTipo ? "Modifica los datos del tipo de pago" : "Crea un nuevo tipo de pago"}
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
                    placeholder="Ej: Efectivo"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Describe el tipo de pago..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTipo ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Pago</CardTitle>
          <CardDescription>{tiposPago.length} tipos de pago registrados</CardDescription>
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
              {tiposPago.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.id}</TableCell>
                  <TableCell>{tipo.nombre}</TableCell>
                  <TableCell>{tipo.descripcion}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tipo.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tipo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(tipo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(tipo.id)}>
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
