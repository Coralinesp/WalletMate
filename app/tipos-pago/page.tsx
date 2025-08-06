"use client"
import { useEffect, useState } from "react"
import supabase from "../back/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CreditCard, Check } from "lucide-react"
import TiposDePagoFiltro from "../../components/ui/Filtros/TiposDePagoFiltro"
import ReportButton from "@/components/ui/reportButton"

interface TipoDePago {
  id: number
  Descripcion: string | null
  Estado: boolean | null
}

export default function TiposPago() {
  const [tiposPago, setTiposPago] = useState<TipoDePago[]>([])
  const [filtrados, setFiltrados] = useState<TipoDePago[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTipo, setEditingTipo] = useState<TipoDePago | null>(null)
  const [formData, setFormData] = useState({ Descripcion: "", Estado: true })
  const [resetSignal, setResetSignal] = useState(0)

  // Obtiene el id del usuario logueado
  const id_user = typeof window !== "undefined" ? Number(localStorage.getItem("user_id")) : null
  const [descripcionError, setDescripcionError] = useState("")

  const fetchTiposPago = async () => {
    if (!id_user) return
    const { data, error } = await supabase
      .from("TiposDePago")
      .select("*")
      .eq("id_user", id_user)
      .order("id", { ascending: true })
    if (!error && data) {
      setTiposPago(data as TipoDePago[])
      setFiltrados(data as TipoDePago[])
    }
  }

  useEffect(() => {
    fetchTiposPago()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_user])

  const handleFiltrar = (filtros: { texto: string; estado: string }) => {
    const resultado = tiposPago.filter((tipo) => {
      const matchTexto = tipo.Descripcion?.toLowerCase().includes(filtros.texto.toLowerCase()) ?? false
      const matchEstado = filtros.estado ? String(tipo.Estado) === filtros.estado : true
      return matchTexto && matchEstado
    })
    setFiltrados(resultado)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id_user) return

    if (/\d/.test(formData.Descripcion)) {
      alert("La descripción no debe contener números.")
      return
    }

    if (!formData.Descripcion.trim()) {
      setDescripcionError("La descripción no puede estar vacía.")
      return
    }

    if (editingTipo) {
      const { error } = await supabase
        .from("TiposDePago")
        .update({ Descripcion: formData.Descripcion, Estado: formData.Estado })
        .eq("id", editingTipo.id)
      if (!error) await fetchTiposPago()
    } else {
      const { error } = await supabase
        .from("TiposDePago")
        .insert([{ Descripcion: formData.Descripcion, Estado: formData.Estado, id_user }])
      if (!error) await fetchTiposPago()
    }

    setIsDialogOpen(false)
    setEditingTipo(null)
    setFormData({ Descripcion: "", Estado: true })
    setResetSignal((prev) => prev + 1)
    handleFiltrar({ texto: "", estado: "" })
  }
  
  const handleEdit = (tipo: TipoDePago) => {
    setEditingTipo(tipo)
    setFormData({ Descripcion: tipo.Descripcion || "", Estado: tipo.Estado ?? true })
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
            <Button className="bg-[#385bf0] hover:bg-[#132b95]"
              onClick={() => {
                setEditingTipo(null)
                setFormData({ Descripcion: "", Estado: true })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <DialogHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                      {editingTipo ? "Editar Tipo de Pago" : "Nuevo Tipo de Pago"}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-blue-100">
                  {editingTipo ? "Modifica los datos del tipo de pago" : "Configura un nuevo método de pago para tu sistema"}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                  Descripción del tipo de pago
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Ej: Tarjeta de crédito, transferencia bancaria, efectivo..."
                  value={formData.Descripcion}
                  onChange={(e) => {
                    const value = e.target.value
                    setFormData((prev) => ({ ...prev, Descripcion: value }))
                    if (/\d/.test(value)) {
                      setDescripcionError("La descripción no debe contener números.")
                    } else {
                      setDescripcionError("")
                    }
                  }}
                  className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {descripcionError && (
                  <p className="text-sm text-red-600">{descripcionError}</p>
                )}
                <p className="text-xs text-gray-500">Proporciona una descripción clara del método de pago</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado
                </Label>
                <Select
                  value={formData.Estado ? "true" : "false"}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, Estado: value === "true" }))}
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
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>Inactivo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.Descripcion.trim() || !!descripcionError}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingTipo ? "Actualizar" : "Crear Tipo de Pago"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ReportButton data={filtrados} fileName="reporte_transacciones.xlsx" />

      <TiposDePagoFiltro onFiltrar={handleFiltrar} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Pago</CardTitle>
          <CardDescription>{filtrados.length} tipos de pago registrados</CardDescription>
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
              {filtrados.map((tipo) => (
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
