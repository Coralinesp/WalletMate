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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, User } from "lucide-react"

interface Usuario {
  id: number
  nombre: string
  email: string
  rol: "Admin" | "Usuario"
  estado: "Activo" | "Inactivo"
  fechaCreacion: string
  ultimoAcceso: string
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@email.com",
      rol: "Admin",
      estado: "Activo",
      fechaCreacion: "2024-01-01",
      ultimoAcceso: "2024-01-15",
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria.garcia@email.com",
      rol: "Usuario",
      estado: "Activo",
      fechaCreacion: "2024-01-05",
      ultimoAcceso: "2024-01-14",
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos.lopez@email.com",
      rol: "Usuario",
      estado: "Inactivo",
      fechaCreacion: "2024-01-10",
      ultimoAcceso: "2024-01-12",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "Usuario" as "Admin" | "Usuario",
    estado: "Activo" as "Activo" | "Inactivo",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUsuario) {
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === editingUsuario.id
            ? {
                ...usuario,
                nombre: formData.nombre,
                email: formData.email,
                rol: formData.rol,
                estado: formData.estado,
              }
            : usuario,
        ),
      )
    } else {
      const nuevoUsuario: Usuario = {
        id: Math.max(...usuarios.map((u) => u.id)) + 1,
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        estado: formData.estado,
        fechaCreacion: new Date().toISOString().split("T")[0],
        ultimoAcceso: "Nunca",
      }
      setUsuarios((prev) => [...prev, nuevoUsuario])
    }
    setIsDialogOpen(false)
    setEditingUsuario(null)
    setFormData({ nombre: "", email: "", rol: "Usuario", estado: "Activo" })
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id))
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
                setFormData({ nombre: "", email: "", rol: "Usuario", estado: "Activo" })
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
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Rol</Label>
                  <Select
                    value={formData.rol}
                    onValueChange={(value: "Admin" | "Usuario") => setFormData((prev) => ({ ...prev, rol: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Usuario">Usuario</SelectItem>
                      <SelectItem value="Admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value: "Activo" | "Inactivo") =>
                      setFormData((prev) => ({ ...prev, estado: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
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

      {/* Estadísticas de Usuarios */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usuarios.filter((u) => u.estado === "Activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{usuarios.filter((u) => u.rol === "Admin").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuarios */}
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
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge variant={usuario.rol === "Admin" ? "default" : "secondary"}>{usuario.rol}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        usuario.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {usuario.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{usuario.fechaCreacion}</TableCell>
                  <TableCell>{usuario.ultimoAcceso}</TableCell>
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
