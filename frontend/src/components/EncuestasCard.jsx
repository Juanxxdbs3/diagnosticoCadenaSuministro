import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export function EncuestasCard(props) {
  const { title, id } = props;
  const [preguntas, setPreguntas] = useState([]);
  const navigate = useNavigate();

  const cargarPreguntas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/preguntas", {
        id,
      });
      setPreguntas(res.data);
    } catch (err) {
      console.error("Error al cargar preguntas", err);
    }
  };

  const handleClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
      cargarPreguntas();
  }, []);

  return (
    <div onClick={handleClick} className="border border-[#cbd5e1] bg-white shadow-md w-64 h-40 p-4 flex flex-col justify-between rounded-lg hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h3 className="text-[#1e293b] font-semibold text-lg">{title}</h3>
      </div>
      <div className="text-[#334155] text-sm space-y-1">
        <p>Cantidad de preguntas: {preguntas.length}</p>
        <p>Cantidad de respuestas: {id}</p>
      </div>
    </div>
  );
}