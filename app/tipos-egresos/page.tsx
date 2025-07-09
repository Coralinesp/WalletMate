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
  getTiposDeEgresos,
  createTipoDeEgreso,
  updateTipoDeEgreso,
  deleteTipoDeEgreso,
} from "../back/supabasefunctions";

import TiposDeEgresosFiltro, { FiltrosTiposEgresos } from "@/components/ui/Filtros/TiposDeEgresosFiltro";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTipo) {
        const updated = await updateTipoDeEgreso(editingTipo.id, {
          descripcion: formData.Descripcion,
          estado: formData.Estado,
        });
        const nuevaLista = tiposEgresos.map((tipo) =>
          tipo.id === updated.id ? updated : tipo
        );
        setTiposEgresos(nuevaLista);
        setFiltrados(nuevaLista);
      } else {
        const nuevo = await createTipoDeEgreso({
          descripcion: formData.Descripcion,
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
    } catch (error) {
      console.error("Error eliminando tipo de egreso:", error);
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
            <Button
              onClick={() => {
                setEditingTipo(null);
                setFormData({ Descripcion: "", Estado: true });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTipo ? "Editar Tipo de Egreso" : "Nuevo Tipo de Egreso"}</DialogTitle>
              <DialogDescription>
                {editingTipo ? "Modifica la descripción del tipo de egreso" : "Crea un nuevo tipo de egreso"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.Descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Descripcion: e.target.value }))}
                    placeholder="Describe el tipo de egreso..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    className="border rounded px-3 py-2 text-sm"
                    value={formData.Estado ? "true" : "false"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, Estado: e.target.value === "true" }))}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTipo ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
    </div>
  );
}
