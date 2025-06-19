export function EncuestasCard(props) {
  const { title, respuestas, preguntas } = props;
  return (
    <div className="border border-[#cbd5e1] bg-white shadow-md w-64 h-40 p-4 flex flex-col justify-between rounded-lg hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h3 className="text-[#1e293b] font-semibold text-lg">{title}</h3>
        <span className="text-[#64748b] text-xl">...</span>
      </div>
      <div className="text-[#334155] text-sm space-y-1">
        <p>Respuestas: {respuestas}</p>
        <p>Preguntas: {preguntas}</p>
      </div>
    </div>
  );
}