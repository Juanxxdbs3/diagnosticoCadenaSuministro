import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, hasRole, logout } from "../services/auth";
import api from "../api/axios";
import { DashboardHeader } from "../components/DashboardHeader";
import EncuestaDashboardCard from "../components/EncuestaDashboardCard"; // ¡El nuevo componente!

const Dashboard = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Obtener usuario actual
  const user = getCurrentUser();

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

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      {/* Header del Dashboard */}
      <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Bienvenido, <span className="font-semibold">{user?.nombre || 'Usuario'}</span> ({user?.rol})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")} 
            className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-2 rounded hover:bg-[#f1f5f9] transition"
          >
            🏠 Inicio
          </button>
          <button 
            onClick={handleLogout}
            className="text-sm text-white bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="px-6 pt-8 max-w-7xl mx-auto">
        {/* Botones principales según rol */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Botón para Admin/Evaluador: Ver Estadísticas Globales */}
            {(hasRole('admin') || hasRole('evaluador')) && (
              <button
                onClick={() => navigate('/estadisticas-globales')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="text-lg font-semibold">Ver Estadísticas Globales</h3>
                  <p className="text-sm opacity-90">Análisis completo de todas las encuestas</p>
                </div>
              </button>
            )}

            {/* Botón para Empresa: Ver Mi Reporte */}
            {hasRole('empresa') && (
              <button
                onClick={() => navigate('/reporte-empresa')}
                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <h3 className="text-lg font-semibold">Ver Mi Reporte</h3>
                  <p className="text-sm opacity-90">Estadísticas específicas de tu empresa</p>
                </div>
              </button>
            )}

            {/* Botón para Admin: Gestionar Encuestas */}
            {hasRole('admin') && (
              <button
                onClick={() => navigate('/encuestas')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">⚙️</div>
                  <h3 className="text-lg font-semibold">Gestionar Encuestas</h3>
                  <p className="text-sm opacity-90">Crear y administrar encuestas</p>
                </div>
              </button>
            )}

            {/* Botón universal: Ver Encuestas Disponibles */}
            <button
              onClick={() => navigate('/descripcionEncuestas')}
              className="bg-gray-600 hover:bg-gray-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="text-lg font-semibold">Ver Encuestas</h3>
                <p className="text-sm opacity-90">Responder encuestas disponibles</p>
              </div>
            </button>
          </div>
        </div>

        {/* Lista de encuestas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Encuestas Disponibles ({encuestas.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {encuestas.map((encuesta) => (
              <EncuestaDashboardCard key={encuesta.id} encuesta={encuesta} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;