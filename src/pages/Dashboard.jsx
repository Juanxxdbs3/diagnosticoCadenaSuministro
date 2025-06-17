import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [totalEncuestas, setTotalEncuestas] = useState(0);
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
      </div>
    </div>
  );
};

export default Dashboard;
