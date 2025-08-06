"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog,  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, ArrowDownFromLine  } from "lucide-react";
import {getTiposDeEgresos,createTipoDeEgreso,updateTipoDeEgreso,deleteTipoDeEgreso,} from "../back/supabasefunctions";
import TiposDeEgresosFiltro, { FiltrosTiposEgresos } from "@/components/ui/Filtros/TiposDeEgresosFiltro";
import ReportButton from "@/components/ui/reportButton";

interface TipoEgreso {
  id: number;
  Descripcion: string;
  Estado: boolean;
}

export default function TiposEgresos() {
  const [tiposEgresos, setTiposEgresos] = useState<TipoEgreso[]>([]);
  const [filtrados, setFiltrados] = useState<TipoEgreso[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoEgreso | null>(null);
  const [formData, setFormData] = useState({ Descripcion: "", Estado: true });
  const [resetSignal, setResetSignal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");


  const loadTipos = async () => {
    try {
      const data = await getTiposDeEgresos();
      setTiposEgresos(data);
      setFiltrados(data);
    } catch (error) {
      console.error("Error cargando tipos de egresos:", error);
    }
  };

  useEffect(() => {
    loadTipos();
  }, []);

  const handleFiltrar = useCallback((filtros: FiltrosTiposEgresos) => {
    const resultado = tiposEgresos.filter((tipo) => {
      const matchTexto = tipo.Descripcion.toLowerCase().includes(filtros.texto.toLowerCase());
      const matchEstado = filtros.estado ? String(tipo.Estado) === filtros.estado : true;
      return matchTexto && matchEstado;
    });
    setFiltrados(resultado);
  }, [tiposEgresos]);



    const validarFormulario = () => {
    if (!formData.Descripcion.trim()) {
      setFormError("La descripción es obligatoria.");
      return false;
    }
    if (formData.Descripcion.trim().length < 5) {
      setFormError("La descripción debe tener al menos 5 caracteres.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      if (editingTipo) {
        const updated = await updateTipoDeEgreso(editingTipo.id, {
          descripcion: formData.Descripcion.trim(),
          estado: formData.Estado,
        });
        const nuevaLista = tiposEgresos.map((tipo) =>
          tipo.id === updated.id ? updated : tipo
        );
        setTiposEgresos(nuevaLista);
        setFiltrados(nuevaLista);
      } else {
        const nuevo = await createTipoDeEgreso({
          descripcion: formData.Descripcion.trim(),
          estado: formData.Estado,
        });
        const nuevaLista = [...tiposEgresos, nuevo];
        setTiposEgresos(nuevaLista);
        setFiltrados(nuevaLista);
      }
      setIsDialogOpen(false);
      setEditingTipo(null);
      setFormData({ Descripcion: "", Estado: true });
      setResetSignal((prev) => prev + 1);
    } catch (error) {
      console.error("Error guardando tipo de egreso:", error);
      setFormError("Error al guardar el tipo de egreso.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tipo: TipoEgreso) => {
    setEditingTipo(tipo);
    setFormData({ Descripcion: tipo.Descripcion, Estado: tipo.Estado });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTipoDeEgreso(id);
      const nuevaLista = tiposEgresos.filter((tipo) => tipo.id !== id);
      setTiposEgresos(nuevaLista);
      setFiltrados(nuevaLista);
    } catch (error: any) {
      console.error("Error eliminando tipo de egreso:", error);

      // Detectar error por restricción FK y mostrar mensaje adecuado
      const mensaje =
        error?.message?.toLowerCase().includes("foreign key") ||
        error?.message?.toLowerCase().includes("constraint")
          ? "No se puede eliminar este tipo de egreso porque está siendo utilizado en otros registros. Primero elimina o actualiza esos registros."
          : error.message || "Error desconocido al eliminar tipo de egreso.";

      setErrorDialogMessage(mensaje);
      setIsErrorDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Egresos</h1>
          <p className="text-muted-foreground">Gestiona los diferentes tipos de egresos del sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#385bf0] hover:bg-[#132b95]"
              onClick={() => {
                setEditingTipo(null);
                setFormData({ Descripcion: "", Estado: true });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            {/* Header con fondo en degradado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <DialogHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ArrowDownFromLine  className="w-5 h-5" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                      {editingTipo ? "Editar Tipo de Egreso" : "Nuevo Tipo de Egreso"}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-blue-100">
                  {editingTipo
                    ? "Modifica la descripción del tipo de egreso"
                    : "Configura un nuevo tipo de egreso para tu sistema"}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Formulario */}
         <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
              Descripción del tipo de egreso
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Ej: Pago de proveedores, gastos operativos..."
              value={formData.Descripcion}
             onChange={(e) => {
              setFormError(null);
              setFormData((prev) => ({ ...prev, Descripcion: e.target.value }));
            }}
              className={`min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formError ? "border-red-500 focus:ring-red-500" : ""
              }`}
              required
            />
            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}
            <p className="text-xs text-gray-500">
              Proporciona una descripción clara del tipo de egreso
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
              Estado
            </Label>
            <select
              id="estado"
              value={formData.Estado ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Estado: e.target.value === "true" }))
              }
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

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
              disabled={loading}
            >
              {editingTipo ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>

          </DialogContent>
        </Dialog>
      </div>

      <ReportButton data={filtrados} fileName="reporte_transacciones.xlsx" />

      <TiposDeEgresosFiltro onFiltrar={handleFiltrar} resetSignal={resetSignal} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Egresos</CardTitle>
          <CardDescription>{filtrados.length} tipos de egresos registrados</CardDescription>
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
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="sm:max-w-md border-l-4 border-red-500 shadow-lg">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
                </svg>
              </div>
              <DialogTitle className="text-lg text-red-600 font-semibold">
                Error al eliminar
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-700 mt-2 ml-1">
              {errorDialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
