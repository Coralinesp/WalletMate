"use client"

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader, DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import {getRenglonesDeEgresos,createRenglonDeEgreso,updateRenglonDeEgreso,deleteRenglonDeEgreso} from "../back/supabasefunctions";
import RenglonesDeEgresosFiltro, { FiltrosRenglones } from "@/components/ui/Filtros/RenglonesDeEgresosFiltro";
import ReportButton from "@/components/ui/reportButton";

interface RenglonEgreso {
  id: number;
  Descripcion: string;
  Estado: boolean;
}

export default function RenglonesDeEgresos() {
  const [renglones, setRenglones] = useState<RenglonEgreso[]>([]);
  const [filtrados, setFiltrados] = useState<RenglonEgreso[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRenglon, setEditingRenglon] = useState<RenglonEgreso | null>(null);
  const [formData, setFormData] = useState({ Descripcion: "", Estado: true });
  const [resetSignal, setResetSignal] = useState(0);
  const [descripcionError, setDescripcionError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRenglonesDeEgresos();
        setRenglones(data);
        setFiltrados(data);
      } catch (error) {
        console.error("Error al obtener los renglones:", error);
      }
    }
    fetchData();
  }, []);

  const handleFiltrar = useCallback((filtros: FiltrosRenglones) => {
    const resultado = renglones.filter((r) => {
      const matchTexto = r.Descripcion.toLowerCase().includes(filtros.texto.toLowerCase());
      const matchEstado = filtros.estado ? String(r.Estado) === filtros.estado : true;
      return matchTexto && matchEstado;
    });
    setFiltrados(resultado);
  }, [renglones]);

  function validarDescripcion(desc: string): string {
    const texto = desc.trim();
    if (/\d/.test(texto)) return "La descripción no debe contener números.";
    if (texto.length === 0) return "La descripción no puede estar vacía.";
    if (texto.length === 1) return "La descripción debe tener más de una letra.";
    return "";
  }

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, Descripcion: value }));
    setDescripcionError(validarDescripcion(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validarDescripcion(formData.Descripcion);
    if (error) {
      setDescripcionError(error);
      return;
    }
    setDescripcionError("");

    // tu lógica para guardar (crear o actualizar)
    try {
      if (editingRenglon) {
        const actualizado = await updateRenglonDeEgreso(editingRenglon.id, {
          descripcion: formData.Descripcion,
          estado: formData.Estado,
        });
        const nuevaLista = renglones.map((r) =>
          r.id === actualizado.id ? actualizado : r
        );
        setRenglones(nuevaLista);
        setFiltrados(nuevaLista);
      } else {
        const nuevo = await createRenglonDeEgreso({
          descripcion: formData.Descripcion,
          estado: formData.Estado,
        });
        const nuevaLista = [...renglones, nuevo];
        setRenglones(nuevaLista);
        setFiltrados(nuevaLista);
      }
      setIsDialogOpen(false);
      setEditingRenglon(null);
      setFormData({ Descripcion: "", Estado: true });
      setResetSignal((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error al guardar el renglón:", error?.message || error);
    }
  };

  const handleEdit = (r: RenglonEgreso) => {
    setEditingRenglon(r);
    setFormData({ Descripcion: r.Descripcion, Estado: r.Estado });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRenglonDeEgreso(id);
      const nuevaLista = renglones.filter((r) => r.id !== id);
      setRenglones(nuevaLista);
      setFiltrados(nuevaLista);
    } catch (error) {
      console.error("Error al eliminar el renglón:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Renglones de Egresos</h1>
          <p className="text-muted-foreground">Gestiona los renglones definidos para egresos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#385bf0] hover:bg-[#132b95]"
              onClick={() => {
                setEditingRenglon(null);
                setFormData({ Descripcion: "", Estado: true });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Renglón
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            {/* Header con fondo degradado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <DialogHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Edit className="w-5 h-5" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                      {editingRenglon ? "Editar Renglón" : "Nuevo Renglón"}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-blue-100">
                  {editingRenglon
                    ? "Modifica los datos del renglón"
                    : "Crea un nuevo renglón de egreso"}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                  Descripción del renglón
                </Label>
                 <Textarea
                    id="descripcion"
                    placeholder="Ej: Pago de servicios, gastos operativos..."
                    value={formData.Descripcion}
                    onChange={handleDescripcionChange} // <-- aquí el cambio importante
                    className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {descripcionError && (
                    <p className="text-sm text-red-600">{descripcionError}</p> // mensaje de error
                  )}
                  <p className="text-xs text-gray-500">
                    Proporciona una descripción clara del renglón de egreso
                  </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado
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
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>Inactivo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

               {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.Descripcion.trim() || !!descripcionError} // <-- aquí se deshabilita si hay error
                >
                  {editingRenglon ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ReportButton data={filtrados} fileName="reporte_transacciones.xlsx" />

      {/* Filtro */}
      <RenglonesDeEgresosFiltro onFiltrar={handleFiltrar} resetSignal={resetSignal} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Renglones</CardTitle>
          <CardDescription>{filtrados.length} renglones registrados</CardDescription>
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
              {filtrados.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.Descripcion}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        r.Estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.Estado ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(r)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)}>
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
  );
}
