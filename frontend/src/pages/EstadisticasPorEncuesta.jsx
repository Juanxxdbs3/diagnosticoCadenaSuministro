import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEncuestaStats } from '../services/stats';
import GraficoResultados from '../components/GraficoResultados';
import { Header } from '../components/Header'; // ⚡ CAMBIO: PageHeader → Header

function EstadisticasPorEncuesta() {
  const { encuestaId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("🔍 [FRONTEND] Solicitando stats para encuesta:", encuestaId);
    setLoading(true);
    setError('');
    
    fetchEncuestaStats(encuestaId)
      .then(res => {
        console.log("✅ [FRONTEND] Stats de encuesta recibidas:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error("❌ [FRONTEND] Error cargando stats de encuesta:", err);
        setError('No se pudieron cargar las estadísticas de la encuesta.');
      })
      .finally(() => {
        console.log("🏁 [FRONTEND] Finalizando carga de stats de encuesta");
        setLoading(false);
      });
  }, [encuestaId]);

  if (loading) return <p className="p-8 text-center">Cargando estadísticas...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  
  if (!data || !data.questionStats || data.questionStats.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* ⚡ CAMBIO: Header unificado */}
        <Header 
          title="Estadísticas de la Encuesta" 
          subtitle={`Encuesta ID: ${encuestaId}`}
          showDashboard={true}
        />
        
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <section className="bg-white p-6 rounded-xl shadow-lg mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Promedio por Pregunta</h2>
              <GraficoResultados
                labels={["Sin datos"]}
                values={[0]}
                title="Promedio por Pregunta"
              />
              <p className="text-center text-gray-500 mt-4">Aún no se han registrado respuestas para esta encuesta.</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  const labels = data.questionStats.map(q => q.questionText);
  const values = data.questionStats.map(q => parseFloat(q.avgScore));

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ⚡ CAMBIO: Header unificado */}
      <Header 
        title="Estadísticas de la Encuesta" 
        subtitle={`Encuesta ID: ${encuestaId}`}
        showDashboard={true}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Resumen General */}
          <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen General</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{parseFloat(data.overall.overallAvg).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Promedio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{parseFloat(data.overall.overallVariance).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Varianza</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{parseFloat(data.overall.overallStddev).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Desv. Estándar</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${
                  data.overall.status === 'fortaleza' ? 'text-green-600' :
                  data.overall.status === 'deficiente' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {data.overall.status.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">Estado</p>
              </div>
            </div>
          </section>

          {/* Gráfico */}
          <section className="bg-white p-6 rounded-xl shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Promedio por Pregunta</h2>
            <GraficoResultados
              labels={labels}
              values={values}
              title="Promedio por Pregunta"
            />
          </section>

          {/* Tabla detallada */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detalle Estadístico</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Pregunta</th>
                    <th className="px-6 py-3 text-center">Promedio</th>
                    <th className="px-6 py-3 text-center">Varianza</th>
                    <th className="px-6 py-3 text-center">Desv. Estándar</th>
                  </tr>
                </thead>
                <tbody>
                  {data.questionStats.map((q, idx) => (
                    <tr key={q.questionId || idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{q.questionText}</td>
                      <td className="px-6 py-4 text-center font-bold">{parseFloat(q.avgScore).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">{parseFloat(q.variance).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">{parseFloat(q.stddev).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasPorEncuesta;