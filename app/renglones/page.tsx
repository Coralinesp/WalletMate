"use client";

import { useEffect, useState, useCallback } from "react";
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
  getRenglonesDeEgresos,
  createRenglonDeEgreso,
  updateRenglonDeEgreso,
  deleteRenglonDeEgreso
} from "../back/supabasefunctions";

import RenglonesDeEgresosFiltro, { FiltrosRenglones } from "@/components/ui/Filtros/RenglonesDeEgresosFiltro";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRenglon) {
        const actualizado = await updateRenglonDeEgreso(editingRenglon.id, {
          descripcion: formData.Descripcion,
          estado: formData.Estado,
        });
        const nuevaLista = renglones.map((r) => (r.id === actualizado.id ? actualizado : r));
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
      setResetSignal((prev) => prev + 1); // resetea filtros
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
            <Button
              onClick={() => {
                setEditingRenglon(null);
                setFormData({ Descripcion: "", Estado: true });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Renglón
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRenglon ? "Editar Renglón" : "Nuevo Renglón"}</DialogTitle>
              <DialogDescription>
                {editingRenglon
                  ? "Modifica los datos del renglón"
                  : "Crea un nuevo renglón de egreso"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.Descripcion}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, Descripcion: e.target.value }))
                    }
                    placeholder="Describe el renglón de egreso..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    value={formData.Estado ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        Estado: e.target.value === "true",
                      }))
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingRenglon ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
