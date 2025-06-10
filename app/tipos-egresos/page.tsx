"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  getTiposDeEgresos,
  createTipoDeEgreso,
  updateTipoDeEgreso,
  deleteTipoDeEgreso,
} from "../back/supabasefunctions"

interface TipoEgreso {
  id: number
  Descripcion: string
  Estado: boolean
}

export default function TiposEgresos() {
  const [tiposEgresos, setTiposEgresos] = useState<TipoEgreso[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState<TipoEgreso | null>(null)
  const [formData, setFormData] = useState({ Descripcion: "", Estado: true })

  const loadTipos = async () => {
    try {
      const data = await getTiposDeEgresos()
      setTiposEgresos(data)
    } catch (error) {
      console.error("Error cargando tipos de egresos:", error)
    }
  }

  useEffect(() => {
    loadTipos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTipo) {
        const updated = await updateTipoDeEgreso(editingTipo.id, {
          descripcion: formData.Descripcion,
          estado: formData.Estado,
        })
        setTiposEgresos((prev) =>
          prev.map((tipo) => (tipo.id === updated.id ? updated : tipo))
        )
      } else {
        const nuevo = await createTipoDeEgreso({
          descripcion: formData.Descripcion,
          estado: formData.Estado,
        })
        setTiposEgresos((prev) => [...prev, nuevo])
      }
      setIsDialogOpen(false)
      setEditingTipo(null)
      setFormData({ Descripcion: "", Estado: true })
    } catch (error) {
      console.error("Error guardando tipo de egreso:", error)
    }
  }

  const handleEdit = (tipo: TipoEgreso) => {
    setEditingTipo(tipo)
    setFormData({ Descripcion: tipo.Descripcion, Estado: tipo.Estado })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTipoDeEgreso(id)
      setTiposEgresos((prev) => prev.filter((tipo) => tipo.id !== id))
    } catch (error) {
      console.error("Error eliminando tipo de egreso:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Egresos</h1>
          <p className="text-muted-foreground">Gestiona los diferentes tipos de egresos del sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTipo(null)
                setFormData({ Descripcion: "", Estado: true })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTipo ? "Editar Tipo de Egreso" : "Nuevo Tipo de Egreso"}</DialogTitle>
              <DialogDescription>
                {editingTipo ? "Modifica la descripción del tipo de egreso" : "Crea un nuevo tipo de egreso"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.Descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Descripcion: e.target.value }))}
                    placeholder="Describe el tipo de egreso..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    className="border rounded px-3 py-2 text-sm"
                    value={formData.Estado ? "true" : "false"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Estado: e.target.value === "true" }))}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
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
          <CardTitle>Lista de Tipos de Egresos</CardTitle>
          <CardDescription>{tiposEgresos.length} tipos de egresos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposEgresos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.id}</TableCell>
                  <TableCell>{tipo.Descripcion}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tipo.Estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tipo.Estado ? "Activo" : "Inactivo"}
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
