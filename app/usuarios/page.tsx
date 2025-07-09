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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, User } from "lucide-react"

interface Usuario {
  id: number
  Nombre: string
  Cedula: number | null
  LimiteDeEgresos: number | null
  FechaDeCorte: string | null
  Estado: boolean | null
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    Nombre: "",
    Cedula: "",
    LimiteDeEgresos: "",
    FechaDeCorte: "",
    Estado: "true",
  })

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from("Usuarios").select("*")
    if (!error && data) setUsuarios(data)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const usuarioData = {
      Nombre: formData.Nombre,
      Cedula: formData.Cedula ? Number(formData.Cedula) : null,
      LimiteDeEgresos: formData.LimiteDeEgresos ? Number(formData.LimiteDeEgresos) : null,
      FechaDeCorte: formData.FechaDeCorte,
      Estado: formData.Estado === "true",
    }

    if (editingUsuario) {
      await supabase.from("Usuarios").update(usuarioData).eq("id", editingUsuario.id)
    } else {
      await supabase.from("Usuarios").insert(usuarioData)
    }

    setFormData({
      Nombre: "",
      Cedula: "",
      LimiteDeEgresos: "",
      FechaDeCorte: "",
      Estado: "true",
    })
    setIsDialogOpen(false)
    setEditingUsuario(null)
    fetchUsuarios()
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      Nombre: usuario.Nombre || "",
      Cedula: usuario.Cedula?.toString() || "",
      LimiteDeEgresos: usuario.LimiteDeEgresos?.toString() || "",
      FechaDeCorte: usuario.FechaDeCorte || "",
      Estado: usuario.Estado?.toString() || "true",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    await supabase.from("Usuarios").delete().eq("id", id)
    fetchUsuarios()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema financiero</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingUsuario(null)
                setFormData({
                  Nombre: "",
                  Cedula: "",
                  LimiteDeEgresos: "",
                  FechaDeCorte: "",
                  Estado: "true",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
              <DialogDescription>
                {editingUsuario ? "Modifica los datos del usuario" : "Crea un nuevo usuario del sistema"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nombre</Label>
                  <Input value={formData.Nombre} onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label>Cédula</Label>
                  <Input type="number" value={formData.Cedula} onChange={(e) => setFormData({ ...formData, Cedula: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Límite de Egresos</Label>
                  <Input type="number" value={formData.LimiteDeEgresos} onChange={(e) => setFormData({ ...formData, LimiteDeEgresos: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Fecha de Corte</Label>
                  <Input
                    type="date"
                    value={formData.FechaDeCorte}
                    onChange={(e) => setFormData({ ...formData, FechaDeCorte: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select value={formData.Estado} onValueChange={(value) => setFormData({ ...formData, Estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Activo</SelectItem>
                      <SelectItem value="false">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingUsuario ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usuarios.filter((u) => u.Estado === true).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>{usuarios.length} usuarios registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Límite</TableHead>
                <TableHead>Fecha Corte</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.Nombre}</TableCell>
                  <TableCell>{usuario.Cedula}</TableCell>
                  <TableCell>{usuario.LimiteDeEgresos}</TableCell>
                  <TableCell>{usuario.FechaDeCorte}</TableCell>
                  <TableCell>
                    <Badge className={usuario.Estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {usuario.Estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(usuario)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(usuario.id)}>
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