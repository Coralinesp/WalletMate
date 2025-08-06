"use client";

import { useEffect, useState, useCallback } from "react";
import supabase from "../back/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User, CreditCard, DollarSign, SlidersHorizontal  } from "lucide-react";


interface Usuario {
  id: number;
  Nombre: string;
  Cedula: number | null;
  LimiteDeEgresos: number | null;
  FechaDeCorte: string | null;
  Estado: boolean | null;
  Balance: number | null;
  admin?: number | null;
}
interface FormErrors {
  Nombre?: string;
  Cedula?: string;
  LimiteDeEgresos?: string;
  FechaDeCorte?: string;
  Balance?: string;
}
interface FiltrosUsuarios {
  estado?: string;
  searchTerm?: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtrados, setFiltrados] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [cedulaError, setCedulaError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");


  const [formData, setFormData] = useState({
    Nombre: "",
    Cedula: "",
    LimiteDeEgresos: "",
    FechaDeCorte: "",
    Balance: "",
    Estado: "true",
    admin: "1",
  });

  const fetchUsuarios = async () => {
    const { data: users, error } = await supabase.from("Usuarios").select("*");
    const { data: trans } = await supabase.from("Transacciones").select("*");

    if (!error && users) {
      const balances: Record<number, number> = {};
      trans?.forEach((t: any) => {
        if (!balances[t.user_id]) balances[t.user_id] = 0;
        balances[t.user_id] +=
          t.tipo_transaccion === "Ingreso"
            ? Number(t.monto || 0)
            : -Number(t.monto || 0);
      });

      const usersWithBalance = users.map((u: any) => ({
        ...u,
        Balance: balances[u.id] ?? 0,
      }));

      setUsuarios(usersWithBalance);
      setFiltrados(usersWithBalance);
    }
  };

  async function deleteUsuarioConDatos(id: number) {
    try {
      const { data: tiposEgresos } = await supabase.from("TiposDeEgresos").select("id").eq("id_user", id);
      const tiposEgresosIds = tiposEgresos?.map((t: any) => t.id) || [];
      if (tiposEgresosIds.length > 0) {
        await supabase.from("GestionDeEgresos").delete().in("TipoDeEgreso", tiposEgresosIds);
      }
      await supabase.from("TiposDeEgresos").delete().eq("id_user", id);
      const { data: tiposIngresos } = await supabase.from("TiposDeIngresos").select("id").eq("id_user", id);
      const tiposIngresosIds = tiposIngresos?.map((t: any) => t.id) || [];
      if (tiposIngresosIds.length > 0) {
        await supabase.from("GestionDeIngresos").delete().in("TipoDeIngreso", tiposIngresosIds);
      }
      await supabase.from("TiposDeIngresos").delete().eq("id_user", id);
      await supabase.from("TiposDePago").delete().eq("id_user", id);
      const { error } = await supabase.from("Usuarios").delete().eq("id", id);

      if (error) {
        alert("Error al eliminar el usuario.");
        console.error(error);
      } else {
        alert("Usuario y todos sus datos relacionados eliminados correctamente.");
      }
    } catch (err) {
      alert("Error inesperado eliminando el usuario.");
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleFiltrar = (filtros: FiltrosUsuarios) => {
    if (filtros.searchTerm !== undefined) {
      setSearchTerm(filtros.searchTerm);
    }
    if (filtros.estado !== undefined) {
      setEstadoFiltro(filtros.estado);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const usuarioData = {
      Nombre: formData.Nombre,
      Cedula: formData.Cedula ? Number(formData.Cedula) : null,
      LimiteDeEgresos: formData.LimiteDeEgresos ? Number(formData.LimiteDeEgresos) : null,
      FechaDeCorte: formData.FechaDeCorte,
      Balance: formData.Balance ? Number(formData.Balance) : null,
      Estado: formData.Estado === "true",
      admin: Number(formData.admin),
    };

    try {
      if (editingUsuario) {
        await supabase.from("Usuarios").update(usuarioData).eq("id", editingUsuario.id);
      } else {
        await supabase.from("Usuarios").insert(usuarioData);
      }

      setFormData({
        Nombre: "",
        Cedula: "",
        LimiteDeEgresos: "",
        FechaDeCorte: "",
        Balance: "",
        Estado: "true",
        admin: "1",
      });
      setErrors({});
      setIsDialogOpen(false);
      setEditingUsuario(null);
      await fetchUsuarios();
      setResetSignal((prev) => prev + 1);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimiteChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, LimiteDeEgresos: value }));
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      Nombre: usuario.Nombre || "",
      Cedula: usuario.Cedula?.toString() || "",
      LimiteDeEgresos: usuario.LimiteDeEgresos?.toString() || "",
      FechaDeCorte: usuario.FechaDeCorte || "",
      Balance: usuario.Balance?.toString() || "",
      Estado: usuario.Estado?.toString() || "true",
      admin: usuario.admin?.toString() || "1",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario y sus datos relacionados?")) return;
    await deleteUsuarioConDatos(id);
    await fetchUsuarios();
  };

  const handleAdminChange = async (id: number, newAdmin: number) => {
    await supabase.from("Usuarios").update({ admin: newAdmin }).eq("id", id);
    fetchUsuarios();
  };

  function validarCedulaDominicana(cedula: string): boolean {
    cedula = cedula.replace(/-/g, "");

    if (!/^\d{11}$/.test(cedula)) return false;

    const coeficientes = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 10; i++) {
      let producto = parseInt(cedula[i]) * coeficientes[i];
      if (producto > 9) producto -= 9;
      suma += producto;
    }

    const verificador = (10 - (suma % 10)) % 10;
    return verificador === parseInt(cedula[10]);
  }

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.Nombre.trim()) newErrors.Nombre = "El nombre es requerido.";
    if (!formData.Cedula.trim()) newErrors.Cedula = "La cédula es requerida.";
    else if (isNaN(Number(formData.Cedula))) newErrors.Cedula = "Debe ser numérica.";
    if (!formData.LimiteDeEgresos.trim()) newErrors.LimiteDeEgresos = "Límite requerido.";
    if (!formData.FechaDeCorte.trim()) newErrors.FechaDeCorte = "Fecha requerida.";
    if (!formData.Balance.trim()) newErrors.Balance = "Balance requerido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const cedulaStr = usuario.Cedula ? usuario.Cedula.toString() : "";

    const matchesSearch =
      usuario.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cedulaStr.includes(searchTerm);

    const matchesEstado =
      estadoFiltro === "todos" || String(usuario.Estado) === estadoFiltro;

    return matchesSearch && matchesEstado;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema financiero</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#385bf0] hover:bg-[#132b95]"
              onClick={() => {
                setEditingUsuario(null);
                setFormData({
                  Nombre: "",
                  Cedula: "",
                  LimiteDeEgresos: "",
                  FechaDeCorte: "",
                  Balance: "",
                  Estado: "true",
                  admin: "1",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingUsuario
                  ? "Modifica los datos del usuario"
                  : "Crea un nuevo usuario del sistema"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Nombre Completo
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ingresa el nombre completo"
                    value={formData.Nombre}
                    onChange={(e) => handleInputChange("Nombre", e.target.value)}
                    className={errors.Nombre ? "border-blue-500 focus-visible:ring-blue-500" : ""}
                    disabled={isLoading}
                    required
                  />
                  {errors.Nombre && <p className="text-sm text-blue-700">{errors.Nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedula" className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Cédula
                  </Label>
                  <Input
                    id="cedula"
                    placeholder="Número de cédula"
                    value={formData.Cedula}
                    onChange={(e) => handleInputChange("Cedula", e.target.value.replace(/\D/g, ""))}
                    className={errors.Cedula ? "border-blue-500 focus-visible:ring-blue-500" : ""}
                    disabled={isLoading}
                    required
                  />
                  {errors.Cedula && <p className="text-sm text-blue-700">{errors.Cedula}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limite" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    Límite de Egresos
                  </Label>
                  <div className="relative">
                    <Input
                      id="limite"
                      placeholder="0"
                      value={formData.LimiteDeEgresos}
                      onChange={(e) => handleLimiteChange(e.target.value)}
                      className={errors.LimiteDeEgresos ? "border-blue-500 focus-visible:ring-blue-500 pl-8" : "pl-8"}
                      disabled={isLoading}
                      required
                    />
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
                  </div>
                  {errors.LimiteDeEgresos && <p className="text-sm text-blue-700">{errors.LimiteDeEgresos}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaCorte" className="text-sm font-medium">
                    Fecha de Corte
                  </Label>
                  <Input
                    id="fechaCorte"
                    type="date"
                    value={formData.FechaDeCorte}
                    onChange={(e) => handleInputChange("FechaDeCorte", e.target.value)}
                    className={errors.FechaDeCorte ? "border-blue-500 focus-visible:ring-blue-500" : ""}
                    disabled={isLoading}
                    required
                  />
                  {errors.FechaDeCorte && <p className="text-sm text-blue-700">{errors.FechaDeCorte}</p>}
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select value={formData.Estado} onValueChange={(value) => setFormData({ ...formData, Estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          Activo
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          Inactivo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    "Guardando..."
                  ) : editingUsuario ? (
                    "Actualizar"
                  ) : (
                    "Crear Usuario"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usuariosFiltrados.length}</div>
        </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usuariosFiltrados.filter((u) => u.Estado === true).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>{usuariosFiltrados.length} usuarios registrados en el sistema</CardDescription>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          {/* Barra de búsqueda */}
          <div className="flex-1">
            <Input
              placeholder="Buscar usuario por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

        {/* Filtro de estado */}
        <div className="flex items-center gap-2">
          <Select value={estadoFiltro} onValueChange={(value) => setEstadoFiltro(value)}>    
            <SelectTrigger className="w-[150px]">
              <SlidersHorizontal   className="h-5 w-5 text-muted-foreground" />
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
</div>

        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Límite</TableHead>
                <TableHead>Fecha Corte</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.Nombre}</TableCell>
                  <TableCell>{usuario.Cedula}</TableCell>
                  <TableCell>{usuario.LimiteDeEgresos}</TableCell>
                  <TableCell>{usuario.FechaDeCorte}</TableCell>
                  <TableCell>
                    {usuario.admin === 2 ? "Admin" : "Usuario"}
                  </TableCell>
                  <TableCell>
                    <span className={usuario.Balance && usuario.Balance < 0 ? "text-red-600" : "text-green-600"}>
                      {usuario.Balance}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={usuario.Estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {usuario.Estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(usuario)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(usuario.id)}>
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
