"use client";

import { useEffect, useState } from "react";
import supabase from "../back/supabase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import ReportButton from "@/components/ui/reportButton";

interface Transaccion {
  id: number;
  user_id: number | null;
  tipo_transaccion: "Ingreso" | "Egreso";
  monto: number | null;
  fecha: string | null;
  descripcion: string | null;
}

interface Usuario {
  id: number;
  Nombre: string;
}

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaccion | null>(null);
  const [formData, setFormData] = useState({
    user_id: "",
    tipo_transaccion: "Ingreso",
    monto: "",
    fecha: "",
    descripcion: "",
  });

  const fetchData = async () => {
    const { data: trans } = await supabase.from("Transacciones").select("*");
    const { data: users } = await supabase.from("Usuarios").select("id, Nombre");
    if (trans) setTransacciones(trans);
    if (users) setUsuarios(users);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.user_id ||
      !formData.monto ||
      !formData.fecha ||
      !formData.descripcion
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const dataToSend = {
      user_id: Number(formData.user_id),
      tipo_transaccion: formData.tipo_transaccion,
      monto: formData.monto ? Number(formData.monto) : null,
      fecha: formData.fecha,
      descripcion: formData.descripcion,
    };

    if (editing) {
      await supabase
        .from("Transacciones")
        .update(dataToSend)
        .eq("id", editing.id);
    } else {
      await supabase.from("Transacciones").insert(dataToSend);
    }
    setFormData({
      user_id: "",
      tipo_transaccion: "Ingreso",
      monto: "",
      fecha: "",
      descripcion: "",
    });
    setEditing(null);
    setIsDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar transacción?")) {
      await supabase.from("Transacciones").delete().eq("id", id);
      fetchData();
    }
  };

  const handleEdit = (t: Transaccion) => {
    setEditing(t);
    setFormData({
      user_id: t.user_id?.toString() || "",
      tipo_transaccion: t.tipo_transaccion,
      monto: t.monto?.toString() || "",
      fecha: t.fecha || "",
      descripcion: t.descripcion || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transacciones</h1>
          <p className="text-muted-foreground">
            Gestiona todas las transacciones del sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setFormData({
                  user_id: "",
                  tipo_transaccion: "Ingreso",
                  monto: "",
                  fecha: "",
                  descripcion: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nueva Transacción
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar" : "Nueva"} Transacción
              </DialogTitle>
              <DialogDescription>
                Completa toda la información de la transacción
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Usuario</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={(v) => setFormData({ ...formData, user_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.Nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo de Transacción</Label>
                <Select
                  value={formData.tipo_transaccion}
                  onValueChange={(v) =>
                    setFormData({ ...formData, tipo_transaccion: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                    <SelectItem value="Egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editing ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ReportButton data={transacciones} fileName="reporte_transacciones.xlsx" />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
          <CardDescription>{transacciones.length} registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacciones.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.fecha}</TableCell>
                  <TableCell>
                    {usuarios.find((u) => u.id === t.user_id)?.Nombre}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.tipo_transaccion === "Ingreso" ? "default" : "destructive"
                      }
                    >
                      {t.tipo_transaccion}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.descripcion}</TableCell>
                  <TableCell
                    className={
                      t.tipo_transaccion === "Ingreso"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ${t.monto?.toLocaleString()}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(t)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
