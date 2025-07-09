import { useEffect, useState } from "react";

export type FiltrosTiposEgresos = {
  texto: string;
  estado: string;
};

type Props = {
  onFiltrar: (filtros: FiltrosTiposEgresos) => void;
  resetSignal?: number;
};

export default function TiposDeEgresosFiltro({ onFiltrar, resetSignal }: Props) {
  const [filtros, setFiltros] = useState<FiltrosTiposEgresos>({
    texto: "",
    estado: "",
  });

  useEffect(() => {
    onFiltrar(filtros);
  }, [filtros]);

  useEffect(() => {
    setFiltros({ texto: "", estado: "" });
  }, [resetSignal]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <input
        type="text"
        placeholder="Buscar descripción..."
        className="border p-2 rounded"
        value={filtros.texto}
        onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
      />
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
  );
}
