import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Para saber quién es el usuario
import api from "../api/axios"; // Usamos nuestra instancia de Axios
import { DashboardHeader } from "../components/DashboardHeader";
import EncuestaDashboardCard from "../components/EncuestaDashboardCard"; // ¡El nuevo componente!

const Dashboard = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Obtenemos la info del usuario logueado

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        // Usamos nuestra instancia 'api' que ya tiene la URL base
        const res = await api.get("/encuestas");
        setEncuestas(res.data);
      } catch (err) {
        console.error("Error al cargar encuestas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEncuestas();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      <DashboardHeader />
      <div className="px-6 pt-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Bienvenido, <span className="font-semibold">{user?.nombre || 'Usuario'}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {encuestas.map((encuesta) => (
            <EncuestaDashboardCard key={encuesta.id} encuesta={encuesta} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;