import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ⚡ AGREGAR
import axios from 'axios';
import GraficoResultados from '../components/GraficoResultados';
import { Header } from '../components/Header';

function ResultadosPage() {
  const { encuestadoId } = useParams(); // ⚡ CAMBIO: Obtener desde URL
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!encuestadoId) {
      setError('ID de encuestado no proporcionado');
      setLoading(false);
      return;
    }

    const fetchResultados = async () => {
      try {
        console.log("🔍 Cargando resultados para encuestado:", encuestadoId);
        const response = await axios.get(`http://localhost:3001/api/resultados/encuestado/${encuestadoId}`);
        setResultados(response.data);
      } catch (err) {
        setError('No se pudieron cargar los resultados. Verifica la conexión con el servidor y la configuración de CORS.');
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [encuestadoId]); // ⚡ CAMBIO: Dependencia de encuestadoId

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header title="Panel de Resultados" subtitle="Cargando..." />
        <div className="flex justify-center items-center h-64 text-gray-700">
          Cargando resultados...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header title="Panel de Resultados" subtitle="Error" />
        <div className="flex justify-center items-center h-64 text-red-500 font-semibold text-center p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!resultados || !resultados.evaluacionGeneral || !resultados.evaluacionGeneral.resultadosPorInstrumento) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header title="Panel de Resultados" subtitle="Sin datos" />
        <div className="flex justify-center items-center h-64">
          No hay resultados para mostrar.
        </div>
      </div>
    );
  }

  const datosEvaluacionGeneral = {
    labels: resultados.evaluacionGeneral.resultadosPorInstrumento.map(item => item.titulo),
    values: resultados.evaluacionGeneral.resultadosPorInstrumento.map(item => item.promedio),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        title="Panel de Resultados" 
        subtitle={`Encuestado: ${resultados.nombreEncuestado} (ID: ${encuestadoId})`}
        showDashboard={true}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{resultados.evaluacionGeneral.titulo}</h2>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-blue-600">
                  {Number(resultados.evaluacionGeneral.promedioTotal).toFixed(2)}
                </span>
                <p className="text-gray-500">Promedio General</p>
              </div>
              <GraficoResultados
                titulo="Promedio por Encuesta"
                datos={datosEvaluacionGeneral}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ResultadosPage;