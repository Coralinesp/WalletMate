"use client"

import { useEffect, useState } from "react"
import supabase from "../back/supabase"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Check, Trash2 } from "lucide-react"
import GestionDeIngresosFiltro from "../../components/ui/Filtros/GestionDeIngresosFiltro"
import ReportButton from '@/components/ui/reportButton'

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
  const [filtrados, setFiltrados] = useState<GestionIngreso[]>([])
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
  // Estados para errores de validación
  const [errorTipoDeIngreso, setErrorTipoDeIngreso] = useState<string>("")
  const [errorDescripcion, setErrorDescripcion] = useState<string>("")
  const [errorUsuario, setErrorUsuario] = useState<string>("")
  const isFormValid =
    formData.TipoDeIngreso !== "" &&
    formData.Descripcion.trim() !== "" &&
    !errorDescripcion &&
    formData.Usuario !== "";

  const fetchData = async () => {
    const { data: ingresos } = await supabase.from("GestionDeIngresos").select("*").order("id", { ascending: true })
    const { data: tipos } = await supabase.from("TiposDeIngresos").select("id, Descripcion")
    const { data: usuarios } = await supabase.from("Usuarios").select("id, Nombre")

    if (ingresos) {
      setIngresos(ingresos as GestionIngreso[])
      setFiltrados(ingresos as GestionIngreso[])
    }
    if (tipos) setTiposDeIngreso(tipos)
    if (usuarios) setUsuarios(usuarios)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFiltrar = (filtros: {
    texto: string;
    tipoDeIngreso: string;
    usuario: string;
    estado: string;
  }) => {
    const resultado = ingresos.filter((ing) => {
      const tipo = tiposDeIngreso.find((t) => t.id === ing.TipoDeIngreso)?.Descripcion || ""
      const user = usuarios.find((u) => u.id === ing.Usuario)?.Nombre || ""

      const matchTexto = ing.Descripcion?.toLowerCase().includes(filtros.texto.toLowerCase()) ?? false
      const matchTipo = filtros.tipoDeIngreso ? tipo === filtros.tipoDeIngreso : true
      const matchUsuario = filtros.usuario ? user === filtros.usuario : true
      const matchEstado = filtros.estado ? String(ing.Estado) === filtros.estado : true

      return matchTexto && matchTipo && matchUsuario && matchEstado
    })
    setFiltrados(resultado)
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reseteo errores
    setErrorTipoDeIngreso("")
    setErrorDescripcion("")
    setErrorUsuario("")

    // Validaciones
    let valid = true

    if (!formData.TipoDeIngreso) {
      setErrorTipoDeIngreso("Debe seleccionar un tipo de ingreso")
      valid = false
    }

    if (!formData.Descripcion.trim()) {
      setErrorDescripcion("La descripción no puede estar vacía")
      valid = false
    } 

    if (!formData.Usuario) {
      setErrorUsuario("Debe seleccionar un usuario")
      valid = false
    }

    if (!valid) return

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
    await fetchData()
    handleFiltrar({ texto: "", tipoDeIngreso: "", usuario: "", estado: "" })
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
  // Función para validar descripción en tiempo real
  const validarDescripcion = (descripcion: string) => {
    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción no puede estar vacía")
      return false
    } else {
      setErrorDescripcion("") // no hay error
      return true
    }
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
            <Button className="bg-[#385bf0] hover:bg-[#132b95]" onClick={() => { setEditingIngreso(null); setFormData({ TipoDeIngreso: "", Descripcion: "", Usuario: "", Estado: true }) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingreso
            </Button>
          </DialogTrigger>
   <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl font-semibold">
                  {editingIngreso ? "Editar Ingreso" : "Nuevo Ingreso"}
                </DialogTitle>
                <DialogDescription className="text-blue-100 mt-1">
                  {editingIngreso ? "Modifica el ingreso" : "Agrega un nuevo ingreso"}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              {/* Tipo de Ingreso */}
              <div className="space-y-1">
                <Label htmlFor="tipo-de-ingreso" className="text-sm font-medium text-gray-700">
                  Tipo de Ingreso
                </Label>
                <Select
                  value={formData.TipoDeIngreso}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, TipoDeIngreso: value }))}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                {errorTipoDeIngreso && <p className="text-red-600 text-sm mt-1">{errorTipoDeIngreso}</p>}
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Escribe una descripción del ingreso..."
                  value={formData.Descripcion}
                  onChange={(e) => {
                    const valor = e.target.value
                    setFormData((prev) => ({ ...prev, Descripcion: valor }))
                    validarDescripcion(valor)
                  }}
                  className="min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errorDescripcion && <p className="text-red-600 text-sm mt-1">{errorDescripcion}</p>}
                <p className="text-xs text-gray-400">{formData.Descripcion.length}/500</p>
              </div>

              {/* Usuario */}
              <div className="space-y-1">
                <Label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                  Usuario Responsable
                </Label>
                <Select
                  value={formData.Usuario}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, Usuario: value }))}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                {errorUsuario && <p className="text-red-600 text-sm mt-1">{errorUsuario}</p>}
              </div>

              {/* Estado */}
              <div className="space-y-1">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado del Registro
                </Label>
                <Select
                  value={formData.Estado ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, Estado: value === "true" }))
                  }
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Activo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Inactivo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botones acción */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingIngreso(null)
                    setErrorTipoDeIngreso("")
                    setErrorDescripcion("")
                    setErrorUsuario("")
                  }}
                  className="px-6"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                  disabled={!isFormValid}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingIngreso ? "Actualizar" : "Registrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ReportButton data={filtrados} fileName="reporte_ingresos.xlsx" />

      <GestionDeIngresosFiltro
        onFiltrar={handleFiltrar}
        tiposDeIngreso={tiposDeIngreso}
        usuarios={usuarios}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ingresos</CardTitle>
          <CardDescription>{filtrados.length} ingresos registrados</CardDescription>
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
              {filtrados.map((ing) => (
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
