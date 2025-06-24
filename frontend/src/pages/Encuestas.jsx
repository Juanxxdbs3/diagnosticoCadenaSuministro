import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { EncuestasCard } from "../components/EncuestasCard";
import { AddEncuestasCard } from "../components/AddEncuestasCard";
import { Header } from "../components/Header";
import { AddEncuestaModal } from "../components/AddEncuestaModal";
import Papa from "papaparse";

const Encuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [sector, setSector] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ titulo: "", sector: "", archivo: null });
  const [data, setData] = useState([]);
  const nEncuestas = 0;

  const cargarEncuestas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/encuestas");
      setEncuestas(res.data);
    } catch (err) {
      console.error("Error al cargar encuestas", err);
    }
  };

  const handleFileAndSubmit = async (file, form) => {
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        const claves = Object.keys(data[0]); // claves del primer objeto
        const valores = data.map((fila) => Object.values(fila)); // array de arrays con los valores
  
        // Enviar todo al backend
        try {
          // 1. Crear encuesta
          const encuestaResponse = await axios.post("http://localhost:3001/api/encuestas", {
            titulo: form.titulo,
            sector: form.sector,
          });

          const encuestaId = encuestaResponse.data.id;

          // 2. Crear preguntas
          const preguntasResponse = await axios.post("http://localhost:3001/api/preguntas", {
            encuestaId,
            claves,
          });

          const preguntaIds = preguntasResponse.data.preguntaIds;

          // 3. Crear respuestas con los IDs de preguntas
          await axios.post("http://localhost:3001/api/respuestas", {
            valores,
            preguntaIds,
          });
  
          // Limpiar formulario, recargar encuestas, cerrar modal
          setForm({ titulo: "", sector: "", archivo: null });
          cargarEncuestas();
          setIsModalOpen(false);
        } catch (err) {
          console.error("Error al guardar encuesta", err);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
  if (!form.archivo) {
    console.error("No hay archivo para procesar.");
    return;
  }

  await handleFileAndSubmit(form.archivo, form);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/encuestas", {
        titulo,
        sector,
      });
      setTitulo("");
      setSector("");
      cargarEncuestas(); // Recargar la lista
    } catch (err) {
      console.error("Error al guardar encuesta", err);
    }
  };

  useEffect(() => {
    cargarEncuestas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      <Header />
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Todas las encuestas ({encuestas.length})</h2>
        <div className="flex flex-wrap gap-6">
          {encuestas.map((e) => (
            <EncuestasCard title={e.titulo}/>
          ))}
        </div>
      </div>
    </div>
    /*
    <AddEncuestasCard onClick={() => setIsModalOpen(true)} />
    <AddEncuestaModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleModalSubmit}
      form={form}
      setForm={setForm}
    />
    */
  );
};

export default Encuestas;
