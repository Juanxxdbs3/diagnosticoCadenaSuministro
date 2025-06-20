export function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">¿Estás seguro de eliminar esta encuesta?</h2>
        <p className="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-sm hover:bg-gray-400">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>
  );
}