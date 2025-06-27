import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GraficoResultados from '../components/GraficoResultados';

function ResultadosPage() {
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const encuestadoId = 1; // hardcoded for testing; replace with dynamic value as needed

  useEffect(() => {
    if (!encuestadoId) return;

    const fetchResultados = async () => {
      try {
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
  }, [encuestadoId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 font-semibold text-center p-4">{error}</div>;
  }

  if (!resultados || !resultados.evaluacionGeneral || !resultados.evaluacionGeneral.resultadosPorInstrumento) {
    return <div className="flex justify-center items-center h-screen">No hay resultados para mostrar.</div>;
  }

  const datosEvaluacionGeneral = {
    labels: resultados.evaluacionGeneral.resultadosPorInstrumento.map(item => item.titulo),
    values: resultados.evaluacionGeneral.resultadosPorInstrumento.map(item => item.promedio),
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Resultados</h1>
          <p className="text-lg text-gray-600">Usuario: {resultados.nombreEncuestado}</p>
        </header>

        <main className="space-y-12">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">{resultados.evaluacionGeneral.titulo}</h2>
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-blue-600">{Number(resultados.evaluacionGeneral.promedioTotal).toFixed(2)}</span>
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
  );
}

export default ResultadosPage;