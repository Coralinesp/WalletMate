"use client"

import { useEffect, useState } from "react"
import supabase from "../back/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

interface GestionIngreso {
  id: number
  TipoDeIngreso: number | null
  Descripcion: string | null
  Usuario: number | null
  Estado: boolean | null
}

interface Opcion {
  id: number
  Nombre?: string
  Descripcion?: string
}

export default function GestionDeIngresos() {
  const [ingresos, setIngresos] = useState<GestionIngreso[]>([])
  const [tiposDeIngreso, setTiposDeIngreso] = useState<Opcion[]>([])
  const [usuarios, setUsuarios] = useState<Opcion[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngreso, setEditingIngreso] = useState<GestionIngreso | null>(null)
  const [formData, setFormData] = useState({
    TipoDeIngreso: "",
    Descripcion: "",
    Usuario: "",
    Estado: true,
  })

  const fetchData = async () => {
    const { data: ingresos } = await supabase.from("GestionDeIngresos").select("*").order("id", { ascending: true })
    const { data: tipos } = await supabase.from("TiposDeIngresos").select("id, Descripcion")
    const { data: usuarios } = await supabase.from("Usuarios").select("id, Nombre")

    if (ingresos) setIngresos(ingresos as GestionIngreso[])
    if (tipos) setTiposDeIngreso(tipos)
    if (usuarios) setUsuarios(usuarios)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSend = {
      TipoDeIngreso: formData.TipoDeIngreso ? parseInt(formData.TipoDeIngreso) : null,
      Descripcion: formData.Descripcion,
      Usuario: formData.Usuario ? parseInt(formData.Usuario) : null,
      Estado: formData.Estado,
    }

    if (editingIngreso) {
      await supabase.from("GestionDeIngresos").update(dataToSend).eq("id", editingIngreso.id)
    } else {
      await supabase.from("GestionDeIngresos").insert([dataToSend])
    }

    setFormData({ TipoDeIngreso: "", Descripcion: "", Usuario: "", Estado: true })
    setEditingIngreso(null)
    setIsDialogOpen(false)
    fetchData()
  }

  const handleEdit = (ingreso: GestionIngreso) => {
    setEditingIngreso(ingreso)
    setFormData({
      TipoDeIngreso: ingreso.TipoDeIngreso?.toString() || "",
      Descripcion: ingreso.Descripcion || "",
      Usuario: ingreso.Usuario?.toString() || "",
      Estado: ingreso.Estado ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    await supabase.from("GestionDeIngresos").delete().eq("id", id)
    fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Ingresos</h1>
          <p className="text-muted-foreground">Registra y administra los ingresos de la empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingIngreso(null); setFormData({ TipoDeIngreso: "", Descripcion: "", Usuario: "", Estado: true }) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIngreso ? "Editar Ingreso" : "Nuevo Ingreso"}</DialogTitle>
              <DialogDescription>{editingIngreso ? "Modifica el ingreso" : "Agrega un nuevo ingreso"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Tipo de Ingreso</Label>
                  <Select
                    value={formData.TipoDeIngreso}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, TipoDeIngreso: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de ingreso" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDeIngreso.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.Descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={formData.Descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Descripcion: e.target.value }))}
                    placeholder="Escribe una descripción del ingreso..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Usuario</Label>
                  <Select
                    value={formData.Usuario}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, Usuario: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.Nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <select
                    value={formData.Estado ? "true" : "false"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Estado: e.target.value === "true" }))}
                    className="border rounded px-2 py-1"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingIngreso ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ingresos</CardTitle>
          <CardDescription>{ingresos.length} ingresos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo de Ingreso</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingresos.map((ing) => (
                <TableRow key={ing.id}>
                  <TableCell>{ing.id}</TableCell>
                  <TableCell>
                    {tiposDeIngreso.find((tipo) => tipo.id === ing.TipoDeIngreso)?.Descripcion || "-"}
                  </TableCell>
                  <TableCell>{ing.Descripcion}</TableCell>
                  <TableCell>
                    {usuarios.find((user) => user.id === ing.Usuario)?.Nombre || "-"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${ing.Estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {ing.Estado ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ing)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(ing.id)}>
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
