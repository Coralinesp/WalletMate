import { useState, useEffect } from "react";

interface FiltroProps {
  onFiltrar: (filtros: {
    texto: string;
    tipoDeIngreso: string;
    usuario: string;
    estado: string;
  }) => void;
  tiposDeIngreso: { id: number; Descripcion?: string }[];
  usuarios: { id: number; Nombre?: string }[];
}

export default function GestionDeIngresosFiltro({ onFiltrar, tiposDeIngreso, usuarios }: FiltroProps) {
  const [filtros, setFiltros] = useState({
    texto: "",
    tipoDeIngreso: "",
    usuario: "",
    estado: "",
  });

  useEffect(() => {
    onFiltrar(filtros);
  }, [filtros]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar descripción..."
          className="border p-2 rounded"
          value={filtros.texto}
          onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={filtros.tipoDeIngreso}
          onChange={(e) => setFiltros({ ...filtros, tipoDeIngreso: e.target.value })}
        >
          <option value="">-- Tipo de Ingreso --</option>
          {tiposDeIngreso.map((tipo) => (
            <option key={tipo.id}>{tipo.Descripcion}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filtros.usuario}
          onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
        >
          <option value="">-- Usuario --</option>
          {usuarios.map((u) => (
            <option key={u.id}>{u.Nombre}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
        >
          <option value="">-- Estado --</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
    </div>
  );
}
