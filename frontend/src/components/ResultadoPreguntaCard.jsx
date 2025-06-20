export function ResultadoPreguntaCard({ pregunta }) {
  return (
    <div className="border border-[#cbd5e1] bg-white shadow-md w-full max-w-xl flex p-4 gap-4 rounded-lg hover:shadow-lg transition">
      <div className="flex flex-col">
        <h3 className="text-[#1e293b] font-semibold text-lg mb-2">{pregunta}</h3>
        <div className="border border-[#cbd5e1] p-3 text-sm text-[#475569] w-40 rounded-md bg-[#f8fafc]">
          <p className="font-medium mb-2">Posibles respuestas</p>
          <ul className="space-y-1">
            <li>──────────</li>
            <li>──────────</li>
            <li>──────────</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-[#475569]">
        <div className="w-32 h-32 border-2 border-[#64748b] rounded-full mb-2"></div>
        <p className="text-sm">Total respuestas: 37</p>
      </div>
    </div>
  );
}