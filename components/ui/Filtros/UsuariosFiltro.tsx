import { useEffect, useState } from "react";

export type FiltrosUsuarios = {
  estado: string;
};

type Props = {
  onFiltrar: (filtros: FiltrosUsuarios) => void;
  resetSignal?: number;
};

export default function UsuariosFiltro({ onFiltrar, resetSignal }: Props) {
  const [filtros, setFiltros] = useState<FiltrosUsuarios>({ estado: "" });

  useEffect(() => {
    onFiltrar(filtros);
  }, [filtros]);

  useEffect(() => {
    setFiltros({ estado: "" });
  }, [resetSignal]);

  return (
    <div className="mb-4">
      <select
        className="border p-2 rounded"
        value={filtros.estado}
        onChange={(e) => setFiltros({ estado: e.target.value })}
      >
        <option value="">-- Estado --</option>
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>
    </div>
  );
}
