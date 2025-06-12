"use client"

import { useEffect, useState } from "react"
import supabase from "../back/supabase"
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

interface TipoDePago {
  id: number
  Descripcion: string | null
  Estado: boolean | null
}

export default function TiposPago() {
  const [tiposPago, setTiposPago] = useState<TipoDePago[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState<TipoDePago | null>(null)
  const [formData, setFormData] = useState({ Descripcion: "", Estado: true })

  const fetchTiposPago = async () => {
    const { data, error } = await supabase.from("TiposDePago").select("*").order("id", { ascending: true })
    if (!error && data) setTiposPago(data as TipoDePago[])
  }

  useEffect(() => {
    fetchTiposPago()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTipo) {
      const { error } = await supabase
        .from("TiposDePago")
        .update({
          Descripcion: formData.Descripcion,
          Estado: formData.Estado,
        })
        .eq("id", editingTipo.id)

      if (!error) fetchTiposPago()
    } else {
      const { error } = await supabase.from("TiposDePago").insert([
        {
          Descripcion: formData.Descripcion,
          Estado: formData.Estado,
        },
      ])
      if (!error) fetchTiposPago()
    }

    setIsDialogOpen(false)
    setEditingTipo(null)
    setFormData({ Descripcion: "", Estado: true })
  }

  const handleEdit = (tipo: TipoDePago) => {
    setEditingTipo(tipo)
    setFormData({
      Descripcion: tipo.Descripcion || "",
      Estado: tipo.Estado ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("TiposDePago").delete().eq("id", id)
    if (!error) fetchTiposPago()
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
                setFormData({ Descripcion: "", Estado: true })
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
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.Descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Descripcion: e.target.value }))}
                    placeholder="Describe el tipo de pago..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    value={formData.Estado ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, Estado: e.target.value === "true" }))
                    }
                    className="border rounded px-2 py-1"
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
          <CardTitle>Lista de Tipos de Pago</CardTitle>
          <CardDescription>{tiposPago.length} tipos de pago registrados</CardDescription>
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
              {tiposPago.map((tipo) => (
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
