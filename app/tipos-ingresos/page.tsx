"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

import {
  getTiposDeIngresos,
  createTipoDeIngreso,
  updateTipoDeIngreso,
  deleteTipoDeIngreso,
} from "../back/supabasefunctions";

import TiposDeIngresosFiltro, { FiltrosTiposIngresos } from "@/components/ui/Filtros/TiposDeIngresosFiltro";

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getTiposDeIngresos();
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
            <Button
              onClick={() => {
                setEditingTipo(null);
                setFormData({ descripcion: "", estado: true });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTipo ? "Editar Tipo de Ingreso" : "Nuevo Tipo de Ingreso"}</DialogTitle>
              <DialogDescription>
                {editingTipo ? "Modifica los datos del tipo de ingreso" : "Crea un nuevo tipo de ingreso"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
                    }
                    placeholder="Describe el tipo de ingreso..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    value={formData.estado ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, estado: e.target.value === "true" }))
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {editingTipo ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
