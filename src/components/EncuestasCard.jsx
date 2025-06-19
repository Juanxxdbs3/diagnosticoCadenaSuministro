export function EncuestasCard(props) {
  const { title, respuestas, preguntas } = props;
  return (
    <div className="border border-black w-64 h-40 p-4 flex flex-col justify-between">
      <div className="flex justify-between">
        <h3 className="text-[#8B1C1C] font-medium">{title}</h3>
        <span className="text-[#8B1C1C]">...</span>
      </div>
      <div className="text-[#8B1C1C] text-sm">
        <p>Respuestas: {respuestas}</p>
        <p>Preguntas: {preguntas}</p>
      </div>
    </div>
  );
}