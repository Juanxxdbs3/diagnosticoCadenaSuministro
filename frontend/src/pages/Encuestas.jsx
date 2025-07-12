import React, { useEffect, useState } from "react";
import api from "../api/axios";
import EncuestasCard from "../components/EncuestasCard";
import PageHeader from "../components/PageHeader";

const Encuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Cargando encuestas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader 
        title="Gestión de Encuestas" 
        subtitle="Lista de todas las encuestas disponibles"
        showDashboard={false}
      />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Botón para agregar nueva encuesta */}
        <div className="mb-6">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            onClick={() => {
              // TODO: Implementar en siguiente fase
              alert('Función de crear encuesta - pendiente de implementar');
            }}
          >
            <span className="text-lg">+</span>
            Crear Nueva Encuesta
          </button>
        </div>

        {/* Lista de encuestas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {encuestas.map((encuesta) => (
            <EncuestasCard 
              key={encuesta.id} 
              encuesta={encuesta} 
            />
          ))}
        </div>

        {encuestas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay encuestas disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encuestas;
