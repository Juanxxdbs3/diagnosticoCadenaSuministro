export function EditEncuestaModal({ isOpen, onClose, onSubmit, form, setForm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-[#1e293b] mb-4">Editar encuesta</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            className="w-full p-3 border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Sector"
            className="w-full p-3 border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-sm hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}