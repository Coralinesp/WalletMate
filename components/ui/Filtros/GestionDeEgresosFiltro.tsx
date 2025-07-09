type OpcionSimple = {
  id: number;
  Descripcion?: string;
};

interface FiltroProps {
  onFiltrar: (filtros: {
    texto: string;
    tipoDeEgreso: string;
    renglonDeEgreso: string;
    tipoDePago: string;
    estado: string;
  }) => void;
  tiposDeEgreso: OpcionSimple[];
  renglonesDeEgreso: OpcionSimple[];
  tiposDePago: OpcionSimple[];
}

import { useState, useEffect } from "react";

export default function GestionDeEgresosFiltro({
  onFiltrar,
  tiposDeEgreso,
  renglonesDeEgreso,
  tiposDePago,
}: FiltroProps) {
  const [filtros, setFiltros] = useState({
    texto: "",
    tipoDeEgreso: "",
    renglonDeEgreso: "",
    tipoDePago: "",
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
          value={filtros.tipoDeEgreso}
          onChange={(e) => setFiltros({ ...filtros, tipoDeEgreso: e.target.value })}
        >
          <option value="">-- Tipo de Egreso --</option>
          {tiposDeEgreso.map((tipo) => (
            <option key={tipo.id}>{tipo.Descripcion}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filtros.renglonDeEgreso}
          onChange={(e) => setFiltros({ ...filtros, renglonDeEgreso: e.target.value })}
        >
          <option value="">-- Renglón --</option>
          {renglonesDeEgreso.map((r) => (
            <option key={r.id}>{r.Descripcion}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filtros.tipoDePago}
          onChange={(e) => setFiltros({ ...filtros, tipoDePago: e.target.value })}
        >
          <option value="">-- Tipo de Pago --</option>
          {tiposDePago.map((p) => (
            <option key={p.id}>{p.Descripcion}</option>
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
