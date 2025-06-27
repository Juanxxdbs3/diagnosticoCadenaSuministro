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

        {(() => {
          const pregunta = preguntas[indice];

          switch (pregunta.tipo) {
            case "escala":
              return (
                <div className="space-y-2 mb-6">
                  {Array.isArray(pregunta.opciones) && pregunta.opciones.map((opcion) => (
                    <label key={opcion.id} className="block">
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}`}
                        value={opcion.valor}
                        checked={respuestas[pregunta.id] === String(opcion.valor)}
                        onChange={(e) =>
                          setRespuestas({ ...respuestas, [pregunta.id]: e.target.value })
                        }
                        className="mr-2"
                      />
                      {opcion.texto}
                    </label>
                  ))}
                </div>
              );

            case "booleano":
              return (
                <div className="space-y-2 mb-6">
                  <label className="block">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value="Sí"
                      checked={respuestas[pregunta.id] === "Sí"}
                      onChange={(e) =>
                        setRespuestas({ ...respuestas, [pregunta.id]: e.target.value })
                      }
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value="No"
                      checked={respuestas[pregunta.id] === "No"}
                      onChange={(e) =>
                        setRespuestas({ ...respuestas, [pregunta.id]: e.target.value })
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              );

            case "texto":
            case "matriz_escala":
            case "matriz_opcion_multiple":
              return (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Ítem</th>
                        {pregunta.opciones.map((opcion) => (
                          <th key={opcion.id} className="border p-2 text-center">
                            {opcion.texto}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pregunta.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="border p-2">{item.texto}</td>
                          {pregunta.opciones.map((opcion) => (
                            <td key={opcion.id} className="border p-2 text-center">
                              <input
                                type="radio"
                                name={`item-${item.id}`}
                                value={opcion.valor ?? opcion.texto}
                                checked={respuestas[item.id] === String(opcion.valor ?? opcion.texto)}
                                onChange={(e) =>
                                  setRespuestas({ ...respuestas, [item.id]: e.target.value })
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            default:
              return (
                <input
                  type="text"
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) =>
                    setRespuestas({ ...respuestas, [pregunta.id]: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg mb-6"
                  placeholder="Escribe tu respuesta aquí..."
                />
              );
          }
        })()}

        <div className="flex justify-between mt-4">
          {indice > 0 ? (
            <button
              onClick={() => setIndice(indice - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
            >
              Anterior
            </button>
          ) : <div></div>}

          <button
            onClick={handleNext}
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg"
          >
            {indice < preguntas.length - 1 ? "Siguiente" : "Finalizar"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResponderEncuesta;
