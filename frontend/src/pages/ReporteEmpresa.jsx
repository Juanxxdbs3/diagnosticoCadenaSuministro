import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth';
import api from '../api/axios';
import GraficoResultados from '../components/GraficoResultados';
import { Header } from '../components/Header'; // ⚡ CAMBIO: PageHeader → Header

function ReporteEmpresa() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    console.log("🔍 [FRONTEND] Cargando reporte para empresa:", user?.id);
    
    setLoading(true);
    setError('');
    
    if (!user || user.rol !== 'empresa') {
      setError('Acceso denegado. Solo empresas pueden ver este reporte.');
      setLoading(false);
      return;
    }
    
    api.get(`/stats/empresa/${user.id}`)
      .then(res => {
        console.log("✅ [FRONTEND] Reporte empresa recibido:", res.data);
        setStats(res.data || []);
      })
      .catch(err => {
        console.error("❌ [FRONTEND] Error cargando reporte empresa:", err);
        setError('No se pudo cargar el reporte de tu empresa.');
        setStats([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const user = getCurrentUser();
  
  // Preparar datos para gráficos
  const labels = stats.map(item => item.encuesta);
  const values = stats.map(item => parseFloat(item.promedio));
  const promedioGeneral = values.length
    ? (values.reduce((acc, curr) => acc + curr, 0) / values.length).toFixed(2)
    : '-';

  if (loading) return <p className="p-8 text-center">Cargando reporte empresarial...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ⚡ CAMBIO: Header unificado */}
      <Header 
        title="Mi Reporte Empresarial" 
        subtitle={`Empresa: ${user?.nombre}`}
        showDashboard={true}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {stats.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sin datos disponibles</h2>
              <p className="text-gray-600">Tu empresa aún no tiene respuestas registradas en ninguna encuesta.</p>
            </div>
          ) : (
            <>
              {/* Promedio General */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-10 text-center">
                <h3 className="text-lg font-medium text-gray-500">Promedio General de Tu Empresa</h3>
                <p className="text-6xl font-bold text-green-600 mt-2">{promedioGeneral}</p>
                <p className="text-sm text-gray-500 mt-2">Basado en {stats.length} instrumentos evaluados</p>
              </div>

              {/* Gráfico */}
              <section className="bg-white p-6 rounded-xl shadow-lg mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Desempeño por Instrumento</h2>
                <GraficoResultados
                  labels={labels}
                  values={values}
                  title="Promedio por Encuesta - Tu Empresa"
                />
              </section>

              {/* Tabla */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Análisis Detallado</h2>
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="px-6 py-3">Instrumento</th>
                        <th scope="col" className="px-6 py-3 text-center">Promedio</th>
                        <th scope="col" className="px-6 py-3 text-center">Desviación Estándar</th>
                        <th scope="col" className="px-6 py-3 text-center">Varianza</th>
                        <th scope="col" className="px-6 py-3 text-center">Nº Respuestas</th>
                        <th scope="col" className="px-6 py-3 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((item, idx) => {
                        const promedio = parseFloat(item.promedio);
                        const estado = promedio < 2 ? 'Deficiente' : promedio > 4 ? 'Fortaleza' : 'Normal';
                        const colorEstado = promedio < 2 ? 'text-red-600' : promedio > 4 ? 'text-green-600' : 'text-yellow-600';
                        
                        return (
                          <tr key={item.encuesta || idx} className="border-b hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {item.encuesta}
                            </th>
                            <td className="px-6 py-4 text-center font-bold">{promedio.toFixed(2)}</td>
                            <td className="px-6 py-4 text-center">{parseFloat(item.desviacion_estandar).toFixed(2)}</td>
                            <td className="px-6 py-4 text-center">{parseFloat(item.varianza).toFixed(2)}</td>
                            <td className="px-6 py-4 text-center">{item.total_respuestas}</td>
                            <td className={`px-6 py-4 text-center font-semibold ${colorEstado}`}>{estado}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReporteEmpresa;