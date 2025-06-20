import { EncuestaCardOptions } from "./EncuestaCardOptions";
import { EditEncuestaModal } from "./EditEncuestaModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useState } from "react";

export function EncuestasCard(props) { //encuesta
  /*
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState({ titulo: encuesta.titulo, sector: encuesta.sector });

  const handleEdit = () => setIsEditOpen(true);
  const handleDelete = () => setIsDeleteOpen(true);
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // lógica para actualizar encuesta
    setIsEditOpen(false);
  };
  const handleConfirmDelete = () => {
    // lógica para eliminar encuesta
    setIsDeleteOpen(false);
  };

  return (
    <div className="relative bg-white border rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold">{encuesta.titulo}</h3>
      <p className="text-sm text-gray-500">{encuesta.sector}</p>
      <div className="absolute top-2 right-2">
        <EncuestaCardOptions onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <EditEncuestaModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        form={form}
        setForm={setForm}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );*/
  const { title, sector } = props;
  return (
    <div className="border border-[#cbd5e1] bg-white shadow-md w-64 h-40 p-4 flex flex-col justify-between rounded-lg hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h3 className="text-[#1e293b] font-semibold text-lg">{title}</h3>
        <span className="text-[#64748b] text-xl">...</span>
      </div>
      <div className="text-[#334155] text-sm space-y-1">
        <p>Sector: {sector}</p>
      </div>
    </div>
  );
}