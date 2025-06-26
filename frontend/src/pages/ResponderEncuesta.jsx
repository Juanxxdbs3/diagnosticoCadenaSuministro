import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";

const ResponderEncuesta = () => {
  const { id } = useParams(); // ID de la encuesta desde la URL
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/preguntas/${id}`);
        setPreguntas(res.data); // Se espera un array de preguntas
      } catch (err) {
        console.error("Error al cargar preguntas", err);
      }
    };

    fetchPreguntas();
  }, [id]);

  const handleChange = (e) => {
    setRespuestas({ ...respuestas, [preguntas[indice].id]: e.target.value });
  };

  const handleNext = () => {
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      // Finalizó la encuesta
      console.log("Respuestas finales:", respuestas);
      // Aquí podrías hacer POST de las respuestas al backend
    }
  };

  if (!preguntas.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Cargando preguntas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-[#1e293b]">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-md mt-10">
        <h2 className="text-xl font-bold mb-4">Pregunta {indice + 1} de {preguntas.length}</h2>
        <p className="text-lg mb-6">{preguntas[indice].texto}</p>

        <input
          type="text"
          value={respuestas[preguntas[indice].id] || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg mb-6"
          placeholder="Escribe tu respuesta aquí..."
        />

        <button
          onClick={handleNext}
          className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg"
        >
          {indice < preguntas.length - 1 ? "Siguiente" : "Finalizar"}
        </button>
      </main>
    </div>
  );
};

export default ResponderEncuesta;
