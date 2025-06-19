import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";

const Dashboard = () => {
  const [totalEncuestas, setTotalEncuestas] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/encuestas")
      .then((res) => setTotalEncuestas(res.data.length))
      .catch((err) => console.error("Error al cargar encuestas", err));
  }, []);

  const handleLogout = () => {
    // Aquí podrías eliminar token si usas JWT
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true, // true si el archivo tiene cabecera
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed Data:", results.data);
          setData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Número total de encuestas: <strong>{totalEncuestas}</strong></p>

      <div className="flex gap-4">
        <Link to="/encuestas" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Ver encuestas
        </Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Cerrar sesión
        </button>
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded mb-4 max-w-150"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex gap-4">
        <h3>Contenido del CSV:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;
