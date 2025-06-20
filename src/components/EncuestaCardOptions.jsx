import { useState } from "react";

export function EncuestaCardOptions({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-xl px-2 py-1 rounded hover:bg-gray-200">...</button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
          <button onClick={onEdit} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Editar</button>
          <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Eliminar</button>
        </div>
      )}
    </div>
  );
}