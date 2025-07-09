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
import GestionDeEgresosFiltro from "../../components/ui/Filtros/GestionDeEgresosFiltro"

interface Egreso {
  id: number
  TipoDeEgreso: number | null
  RenglonDeEgreso: number | null
  TipoDePagoxDefecto: number | null
  Descripcion: string | null
  Estado: boolean | null
}

interface Opcion {
  id: number
  Descripcion?: string
  Nombre?: string
}

export default function GestionDeEgresos() {
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [egresosFiltrados, setEgresosFiltrados] = useState<Egreso[]>([])
  const [tiposDeEgreso, setTiposDeEgreso] = useState<Opcion[]>([])
  const [renglones, setRenglones] = useState<Opcion[]>([])
  const [tiposDePago, setTiposDePago] = useState<Opcion[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEgreso, setEditingEgreso] = useState<Egreso | null>(null)
  const [formData, setFormData] = useState({
    TipoDeEgreso: "",
    RenglonDeEgreso: "",
    TipoDePagoxDefecto: "",
    Descripcion: "",
    Estado: true,
  })

  const fetchData = async () => {
    const { data: egresos } = await supabase.from("GestionDeEgresos").select("*").order("id", { ascending: true })
    const { data: tipos } = await supabase.from("TiposDeEgresos").select("id, Descripcion")
    const { data: renglones } = await supabase.from("RenglonesDeEgresos").select("id, Descripcion")
    const { data: pagos } = await supabase.from("TiposDePago").select("id, Descripcion")

    if (egresos) {
      setEgresos(egresos as Egreso[])
      setEgresosFiltrados(egresos as Egreso[])
    }
    if (tipos) setTiposDeEgreso(tipos)
    if (renglones) setRenglones(renglones)
    if (pagos) setTiposDePago(pagos)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFiltrar = (filtros: {
    texto: string;
    tipoDeEgreso: string;
    renglonDeEgreso: string;
    tipoDePago: string;
    estado: string;
  }) => {
    const resultado = egresos.filter((eg) => {
      const tipo = tiposDeEgreso.find((t) => t.id === eg.TipoDeEgreso)?.Descripcion || ""
      const renglon = renglones.find((r) => r.id === eg.RenglonDeEgreso)?.Descripcion || ""
      const pago = tiposDePago.find((p) => p.id === eg.TipoDePagoxDefecto)?.Descripcion || ""

      const matchTexto = eg.Descripcion?.toLowerCase().includes(filtros.texto.toLowerCase()) ?? false
      const matchTipo = filtros.tipoDeEgreso ? tipo === filtros.tipoDeEgreso : true
      const matchRenglon = filtros.renglonDeEgreso ? renglon === filtros.renglonDeEgreso : true
      const matchPago = filtros.tipoDePago ? pago === filtros.tipoDePago : true
      const matchEstado = filtros.estado ? String(eg.Estado) === filtros.estado : true

      return matchTexto && matchTipo && matchRenglon && matchPago && matchEstado
    })
    setEgresosFiltrados(resultado)
  }

  const [errores, setErrores] = useState({
    TipoDeEgreso: "",
    RenglonDeEgreso: "",
    TipoDePagoxDefecto: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSend = {
      TipoDeEgreso: formData.TipoDeEgreso ? parseInt(formData.TipoDeEgreso) : null,
      RenglonDeEgreso: formData.RenglonDeEgreso ? parseInt(formData.RenglonDeEgreso) : null,
      TipoDePagoxDefecto: formData.TipoDePagoxDefecto ? parseInt(formData.TipoDePagoxDefecto) : null,
      Descripcion: formData.Descripcion,
      Estado: formData.Estado,
    }

    const nuevosErrores = {
      TipoDeEgreso: !formData.TipoDeEgreso ? "Selecciona un tipo de egreso." : "",
      RenglonDeEgreso: !formData.RenglonDeEgreso ? "Selecciona un renglón de egreso." : "",
      TipoDePagoxDefecto: !formData.TipoDePagoxDefecto ? "Selecciona un tipo de pago." : "",
    };

    setErrores(nuevosErrores);

    if (nuevosErrores.TipoDeEgreso || nuevosErrores.RenglonDeEgreso || nuevosErrores.TipoDePagoxDefecto) {
      return;
    }

    if (editingEgreso) {
      await supabase.from("GestionDeEgresos").update(dataToSend).eq("id", editingEgreso.id)
    } else {
      await supabase.from("GestionDeEgresos").insert([dataToSend])
    }

    setFormData({ TipoDeEgreso: "", RenglonDeEgreso: "", TipoDePagoxDefecto: "", Descripcion: "", Estado: true })
    setEditingEgreso(null)
    setIsDialogOpen(false)
    fetchData()
    handleFiltrar({ texto: "", tipoDeEgreso: "", renglonDeEgreso: "", tipoDePago: "", estado: "" })
  }

  const handleEdit = (egreso: Egreso) => {
    setEditingEgreso(egreso)
    setFormData({
      TipoDeEgreso: egreso.TipoDeEgreso?.toString() || "",
      RenglonDeEgreso: egreso.RenglonDeEgreso?.toString() || "",
      TipoDePagoxDefecto: egreso.TipoDePagoxDefecto?.toString() || "",
      Descripcion: egreso.Descripcion || "",
      Estado: egreso.Estado ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    await supabase.from("GestionDeEgresos").delete().eq("id", id)
    fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Egresos</h1>
          <p className="text-muted-foreground">Registra y administra los egresos de la empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#385bf0] hover:bg-[#132b95]" onClick={() => { setEditingEgreso(null); setFormData({ TipoDeEgreso: "", RenglonDeEgreso: "", TipoDePagoxDefecto: "", Descripcion: "", Estado: true }) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Egreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEgreso ? "Editar Egreso" : "Nuevo Egreso"}</DialogTitle>
              <DialogDescription>{editingEgreso ? "Modifica el egreso" : "Agrega un nuevo egreso"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Tipo de Egreso</Label>
                  <Select
                    value={formData.TipoDeEgreso}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, TipoDeEgreso: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de egreso" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDeEgreso.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.Descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errores.TipoDeEgreso && (
                    <p className="text-red-600 text-sm mt-1">{errores.TipoDeEgreso}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Renglón de Egreso</Label>
                  <Select
                    value={formData.RenglonDeEgreso}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, RenglonDeEgreso: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un renglón" />
                    </SelectTrigger>
                    <SelectContent>
                      {renglones.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.Descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errores.RenglonDeEgreso && (
                    <p className="text-red-600 text-sm mt-1">{errores.RenglonDeEgreso}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Tipo de Pago por Defecto</Label>
                  <Select
                    value={formData.TipoDePagoxDefecto}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, TipoDePagoxDefecto: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDePago.map((pago) => (
                        <SelectItem key={pago.id} value={pago.id.toString()}>
                          {pago.Descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errores.TipoDePagoxDefecto && (
                    <p className="text-red-600 text-sm mt-1">{errores.TipoDePagoxDefecto}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={formData.Descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Descripcion: e.target.value }))}
                    placeholder="Escribe una descripción del egreso..."
                  />
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
                <Button type="submit">{editingEgreso ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <GestionDeEgresosFiltro
        onFiltrar={handleFiltrar}
        tiposDeEgreso={tiposDeEgreso}
        renglonesDeEgreso={renglones}
        tiposDePago={tiposDePago}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Egresos</CardTitle>
          <CardDescription>{egresosFiltrados.length} egresos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo de Egreso</TableHead>
                <TableHead>Renglón</TableHead>
                <TableHead>Pago por Defecto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {egresosFiltrados.map((eg) => (
                <TableRow key={eg.id}>
                  <TableCell>{eg.id}</TableCell>
                  <TableCell>{tiposDeEgreso.find((t) => t.id === eg.TipoDeEgreso)?.Descripcion || "-"}</TableCell>
                  <TableCell>{renglones.find((r) => r.id === eg.RenglonDeEgreso)?.Descripcion || "-"}</TableCell>
                  <TableCell>{tiposDePago.find((p) => p.id === eg.TipoDePagoxDefecto)?.Descripcion || "-"}</TableCell>
                  <TableCell>{eg.Descripcion}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${eg.Estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {eg.Estado ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(eg)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(eg.id)}>
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
