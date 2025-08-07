"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getTiposDeIngresos, createTipoDeIngreso, updateTipoDeIngreso, deleteTipoDeIngreso,} from "../back/supabasefunctions";
import TiposDeIngresosFiltro, { FiltrosTiposIngresos } from "@/components/ui/Filtros/TiposDeIngresosFiltro";
import ReportButton from "@/components/ui/reportButton";

interface TipoIngreso {
  id: number;
  Descripcion: string | null;
  Estado: boolean | null;
}

export default function TiposIngresos() {
  const [tiposIngresos, setTiposIngresos] = useState<TipoIngreso[]>([]);
  const [filtrados, setFiltrados] = useState<TipoIngreso[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoIngreso | null>(null);
  const [formData, setFormData] = useState({ descripcion: "", estado: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const id_user = Number(localStorage.getItem("user_id"));
        const data = await getTiposDeIngresos(id_user);
        setTiposIngresos(data);
        setFiltrados(data);
      } catch (e: any) {
        setError("Error al cargar tipos de ingresos.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFiltrar = useCallback((filtros: FiltrosTiposIngresos) => {
    const resultado = tiposIngresos.filter((tipo) => {
      const matchTexto = (tipo.Descripcion || "")
        .toLowerCase()
        .includes(filtros.texto.toLowerCase());
      const matchEstado = filtros.estado ? String(tipo.Estado) === filtros.estado : true;
      return matchTexto && matchEstado;
    });
    setFiltrados(resultado);
  }, [tiposIngresos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const id_user = Number(localStorage.getItem("user_id"));
      if (!id_user || isNaN(id_user)) {
        setError("No se encontró el usuario logueado. Por favor, vuelve a iniciar sesión.");
        setLoading(false);
        return;
      }
      if (editingTipo) {
        const updated = await updateTipoDeIngreso(editingTipo.id, {
          descripcion: formData.descripcion,
          estado: formData.estado,
        });
        const nuevaLista = tiposIngresos.map((t) =>
          t.id === updated.id ? updated : t
        );
        setTiposIngresos(nuevaLista);
        setFiltrados(nuevaLista);
      } else {
        const created = await createTipoDeIngreso({
          descripcion: formData.descripcion,
          estado: formData.estado,
          id_user: id_user,
        });
        const nuevaLista = [...tiposIngresos, created];
        setTiposIngresos(nuevaLista);
        setFiltrados(nuevaLista);
      }
      setIsDialogOpen(false);
      setEditingTipo(null);
      setFormData({ descripcion: "", estado: true });
      setResetSignal((prev) => prev + 1);
    } catch (e: any) {
      setError("Error al guardar el tipo de ingreso.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tipo: TipoIngreso) => {
    setEditingTipo(tipo);
    setFormData({
      descripcion: tipo.Descripcion ?? "",
      estado: tipo.Estado ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTipoDeIngreso(id);
      const nuevaLista = tiposIngresos.filter((t) => t.id !== id);
      setTiposIngresos(nuevaLista);
      setFiltrados(nuevaLista);
    } catch (e: any) {
      setError("Error al eliminar el tipo de ingreso.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Ingresos</h1>
          <p className="text-muted-foreground">Gestiona los diferentes tipos de ingresos del sistema</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#385bf0] hover:bg-[#132b95]"
              onClick={() => {
                setEditingTipo(null);
                setFormData({ descripcion: "", estado: true });
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
                      <Plus className="w-5 h-5" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                      {editingTipo ? "Editar Tipo de Ingreso" : "Nuevo Tipo de Ingreso"}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-blue-100">
                  {editingTipo
                    ? "Modifica los datos del tipo de ingreso"
                    : "Configura un nuevo tipo de ingreso para tu sistema"}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                  Descripción del tipo de ingreso
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Ej: Ingreso por ventas, donaciones, etc."
                  value={formData.descripcion}
                 onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, descripcion: value }));
                  // Validaciones
                  if (!value.trim()) {
                    setDescripcionError("La descripción no puede estar vacía.");
                  } else if (value.trim().length < 5) {
                    setDescripcionError("La descripción debe tener al menos 5 caracteres.");
                  } else if (value.trim().length > 100) {
                    setDescripcionError("La descripción no debe superar los 100 caracteres.");
                  } else {
                    setDescripcionError(null);
                  }
                }}
                  className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />       
                <p className="text-xs text-gray-500">
                  Proporciona una descripción clara del tipo de ingreso
                </p>
                {descripcionError && (
                  <p className="text-sm text-red-600">{descripcionError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado
                </Label>
                <select
                  id="estado"
                  value={formData.estado ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, estado: e.target.value === "true" }))
                  }
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="px-6">
                  Cancelar
                </Button>
                <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700" disabled={loading || !!descripcionError} >
                {editingTipo ? "Actualizar" : "Crear"}
              </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ReportButton data={filtrados} fileName="reporte_transacciones.xlsx" />

      <TiposDeIngresosFiltro onFiltrar={handleFiltrar} resetSignal={resetSignal} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Ingresos</CardTitle>
          <CardDescription>{filtrados.length} tipos de ingresos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
