import { useState, useEffect } from "react";
import axios from "axios";

const Encuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [sector, setSector] = useState("");
  const [id, setId] = useState("");

  const cargarEncuestas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/encuestas");
      setEncuestas(res.data);
    } catch (err) {
      console.error("Error al cargar encuestas", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/encuestas", {
        id,
        titulo,
        sector,
      });
      setId("");
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Encuestas</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="ID"
            className="p-2 border rounded w-full"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Título"
            className="p-2 border rounded w-full"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sector"
            className="p-2 border rounded w-full"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            required
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar Encuesta
        </button>
      </form>

      <div className="grid gap-4">
        {encuestas.map((e) => (
          <div key={e.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-xl font-semibold">{e.id} {e.titulo}</h3>
            <p className="text-gray-500">Sector: {e.sector}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Encuestas;
