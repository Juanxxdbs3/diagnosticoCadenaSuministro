import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEncuestaStats } from '../services/stats';
import GraficoResultados from '../components/GraficoResultados';

function EstadisticasPorEncuesta() {
  const { encuestaId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchEncuestaStats(encuestaId)
      .then(res => setData(res.data))
      .catch(() => setError('No se pudieron cargar las estadísticas de la encuesta.'))
      .finally(() => setLoading(false));
  }, [encuestaId]);

  if (loading) return <p className="p-8 text-center">Cargando estadísticas...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!data || !data.questionStats || data.questionStats.length === 0) {
    // Mostrar gráfico vacío y mensaje
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas de la Encuesta</h1>
          </header>
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
    );
  }

  const labels = data.questionStats.map(q => q.questiontext);
  const values = data.questionStats.map(q => parseFloat(q.avgscore));

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas de la Encuesta</h1>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Promedio por Pregunta</h2>
          <GraficoResultados
            labels={labels}
            values={values}
            title="Promedio por Pregunta"
          />
        </section>

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
                  <tr key={q.questionid || idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{q.questiontext}</td>
                    <td className="px-6 py-4 text-center">{parseFloat(q.avgscore).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">{parseFloat(q.variance).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">{parseFloat(q.stddev).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Resumen General</h3>
          <p>Promedio general: <span className="font-bold">{data.overall.overallAvg}</span></p>
          <p>Varianza general: <span className="font-bold">{data.overall.overallVariance}</span></p>
          <p>Desviación estándar general: <span className="font-bold">{data.overall.overallStddev}</span></p>
          <p>Estado: <span className="font-bold">{data.overall.status}</span></p>
        </section>
      </div>
    </div>
  );
}

export default EstadisticasPorEncuesta;