import { useState, useEffect } from "react";

export type FiltrosTiposDePago = {
  texto: string;
  estado: string;
};

type Props = {
  onFiltrar: (filtros: FiltrosTiposDePago) => void;
  resetSignal?: number;
};

export default function TiposDePagoFiltro({ onFiltrar, resetSignal }: Props) {
  const [filtros, setFiltros] = useState<FiltrosTiposDePago>({
    texto: "",
    estado: "",
  });

  useEffect(() => {
    onFiltrar(filtros);
  }, [filtros]);

  // Reset desde el componente padre
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
