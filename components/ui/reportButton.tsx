import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { utils, writeFile } from 'xlsx';
import { FileText } from 'lucide-react';


interface ReportButtonProps<T> {
  data: T[];
  fileName?: string;
}

const ReportButton = <T extends object>({
  data,
  fileName = 'reporte.xlsx',
}: ReportButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Convertir JSON a hoja de Excel
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Reporte');
    // Descargar archivo
    writeFile(wb, fileName);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="flex gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        onClick={() => setIsOpen(true)}
      >
        Crear reporte
        <FileText />
      </button>

        {isOpen &&
        createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg z-60">
                <p className="mb-4">¿Deseas generar el reporte?</p>
                <div className="flex justify-end space-x-2">
                <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Continuar
                </button>
                </div>
            </div>
            </div>,
            document.body
        )}
    </>
  );
};

export default ReportButton;
