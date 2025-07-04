import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";

const ResponderEncuesta = () => {
  const { id } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [respuestasMatriz, setRespuestasMatriz] = useState([]);
  const [respuestasMatrizMultiple, setRespuestasMatrizMultiple] = useState([]);
  const [encuestadoId, setEncuestadoId] = useState(null);
  const navigate = useNavigate();
  const [datosEncuestado, setDatosEncuestado] = useState({
    empresaId: "",
    sector: "",
    nombreEncuestado: "",
    email: "",
    telefono: ""
  });
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/preguntas/${id}`);
        setPreguntas(res.data);
      } catch (err) {
        console.error("Error al cargar preguntas", err);
      }
    };
    fetchPreguntas();
  }, [id]);

  const handleRespuesta = (preguntaId, texto, opcionId = null) => {
    setRespuestas((prev) => {
      const sinDuplicados = prev.filter(r => r.pregunta_id !== preguntaId);
      return [...sinDuplicados, { pregunta_id: preguntaId, texto, opcion_id: opcionId }];
    });
  };

  const handleRespuestaMatriz = (tipo, itemMatrizId, opcionId) => {
    const nueva = { item_matriz_id: itemMatrizId, opcion_id: opcionId };
    const setFunc = tipo === "matriz_escala" ? setRespuestasMatriz : setRespuestasMatrizMultiple;
    const respuestas = tipo === "matriz_escala" ? respuestasMatriz : respuestasMatrizMultiple;
    const filtradas = respuestas.filter(r => !(r.item_matriz_id === itemMatrizId && r.opcion_id !== opcionId));
    setFunc([...filtradas, nueva]);
  };

  const enviarDatosEncuestado = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/encuestados", datosEncuestado);
      setEncuestadoId(res.data.encuestado_id);
      return res.data.encuestado_id;
    } catch (err) {
      console.error("Error al registrar encuestado", err);
      alert("Error al enviar los datos. Revisa el formulario.");
      throw err;
    }
  };
  
  const handleNext = async () => {
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      if (!validarRespuestasCompletas()) {
        alert("Por favor responde todas las preguntas antes de finalizar.");
        return;
      }
      
      try {
        const id = encuestadoId || await enviarDatosEncuestado();
        await enviarRespuestas(id);
        navigate("/descripcionEncuestas");
      } catch (err) {
        console.error("Error finalizando encuesta", err);
      }
    }
  };
  
  const enviarRespuestas = async (encuestado_id) => {
    try {
      await axios.post("http://localhost:3001/api/respuestas", {
        encuestado_id,
        respuestas,
        respuestas_matriz: respuestasMatriz,
        respuestas_matriz_multiple: respuestasMatrizMultiple,
      });
      alert("¡Respuestas enviadas con éxito!");
    } catch (err) {
      console.error("Error al enviar respuestas", err);
      alert("Hubo un error al guardar tus respuestas.");
    }
  };

  const validarRespuestasCompletas = () => {
    for (const pregunta of preguntas) {
      if (pregunta.tipo === "matriz_escala" || pregunta.tipo === "matriz_opcion_multiple") {
        const respuestasActuales = pregunta.tipo === "matriz_escala" ? respuestasMatriz : respuestasMatrizMultiple;
        for (const item of pregunta.items) {
          const respondido = respuestasActuales.find(r => r.item_matriz_id === item.id);
          if (!respondido) return false;
        }
      } else {
        const respondido = respuestas.find(r => r.pregunta_id === pregunta.id);
        if (!respondido || (!respondido.texto && !respondido.opcion_id)) return false;
      }
    }
    return true;
  };

  if (!flag) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <Header />
        <form onSubmit={() => {setFlag(true);}} className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mt-18">
          <h2 className="text-2xl font-bold mb-4">Datos del Encuestado</h2>
          {[
            ["empresaId", "ID Empresa*"],
            ["sector", "Sector*"],
            ["nombreEncuestado", "Nombre del Encuestado*"],
            ["email", "Correo Electrónico*"],
            ["telefono", "Teléfono*"]
          ].map(([key, label]) => (
            <div key={key} className="mb-4">
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type="text"
                required={label.includes("*")}
                value={datosEncuestado[key]}
                onChange={(e) => setDatosEncuestado({ ...datosEncuestado, [key]: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg">Iniciar Encuesta</button>
        </form>
      </div>
    );
  }

  if (!preguntas.length) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Cargando preguntas...</div>;
  }

  const pregunta = preguntas[indice];
  const respuestaActual = respuestas.find(r => r.pregunta_id === pregunta.id)?.texto || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-[#1e293b]">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-md mt-10">
        <h2 className="text-xl font-bold mb-4">Pregunta {indice + 1} de {preguntas.length}</h2>
        <p className="text-lg mb-6">{pregunta.texto}</p>

        {(() => {
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
                        checked={respuestaActual === opcion.texto}
                        onChange={() => handleRespuesta(pregunta.id, opcion.texto, opcion.id)}
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
                  {["Sí", "No"].map((valor) => (
                    <label key={valor} className="block">
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}`}
                        value={valor}
                        checked={respuestaActual === valor}
                        onChange={() => handleRespuesta(pregunta.id, valor)}
                        className="mr-2"
                      />
                      {valor}
                    </label>
                  ))}
                </div>
              );
            case "matriz_escala":
            case "matriz_opcion_multiple":
              const respuestasMatrizActual = pregunta.tipo === "matriz_escala" ? respuestasMatriz : respuestasMatrizMultiple;
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
                                name={`item-${pregunta.tipo}-${item.id}`}
                                checked={
                                  respuestasMatrizActual.find(r => r.item_matriz_id === item.id)?.opcion_id === opcion.id
                                }
                                value={opcion.id}
                                onChange={() => handleRespuestaMatriz(pregunta.tipo, item.id, opcion.id)}
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
                  value={respuestaActual}
                  onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
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
