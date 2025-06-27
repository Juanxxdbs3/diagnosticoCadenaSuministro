// Archivo a crear: frontend/src/pages/EstadisticasGlobales.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GraficoResultados from '../components/GraficoResultados';

function EstadisticasGlobales() {
  const [stats, setStats] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    axios.get('/api/sectores').then(res => setSectores(res.data));
  }, []);

  useEffect(() => {
    let url = '/api/stats/global?';
    if (sector) url += `sector=${encodeURIComponent(sector)}&`;
    if (tipo) url += `tipo=${tipo}`;
    axios.get(url).then(res => setStats(res.data));
  }, [sector, tipo]);

  // Calcula el promedio general de los instrumentos filtrados
  const promedioGeneral = stats.length
    ? (stats.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0) / stats.length).toFixed(2)
    : '-';

  const chartData = {
    labels: stats.map(item => item.instrumento_titulo),
    values: stats.map(item => parseFloat(item.promedio)),
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas Globales</h1>
          <p className="text-lg text-gray-600">Análisis consolidado de todos los instrumentos y empresas.</p>
        </header>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <select value={sector} onChange={e => setSector(e.target.value)} className="border rounded px-3 py-2">
            <option value="">Todos los sectores</option>
            {sectores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="border rounded px-3 py-2">
            <option value="">Todos</option>
            <option value="deficiencia">Solo Deficiencia (&lt;2)</option>
            <option value="fortaleza">Solo Fortaleza (&gt;4)</option>
          </select>
        </div>

        {/* Promedio General */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 text-center">
          <h3 className="text-lg font-medium text-gray-500">Promedio General de la Evaluación</h3>
          <p className="text-6xl font-bold text-indigo-600 mt-2">{promedioGeneral}</p>
        </div>

        {/* Gráfico de Promedios */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comparativa de Promedios por Instrumento</h2>
          <GraficoResultados datos={chartData} titulo="" />
        </section>

        {/* Tabla de Estadísticas Detalladas */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Análisis Estadístico Detallado</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">Instrumento</th>
                  <th scope="col" className="px-6 py-3 text-center">Promedio</th>
                  <th scope="col" className="px-6 py-3 text-center">Desviación Estándar</th>
                  <th scope="col" className="px-6 py-3 text-center">Varianza</th>
                  <th scope="col" className="px-6 py-3 text-center">Mínimo</th>
                  <th scope="col" className="px-6 py-3 text-center">Máximo</th>
                  <th scope="col" className="px-6 py-3 text-center">Nº Respuestas</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((item) => (
                  <tr key={item.instrumento_id} className="border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.instrumento_titulo}
                    </th>
                    <td className="px-6 py-4 text-center font-bold">{parseFloat(item.promedio).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">{item.desviacion_estandar ? parseFloat(item.desviacion_estandar).toFixed(2) : '-'}</td>
                    <td className="px-6 py-4 text-center">{item.varianza ? parseFloat(item.varianza).toFixed(2) : '-'}</td>
                    <td className="px-6 py-4 text-center">{item.minimo}</td>
                    <td className="px-6 py-4 text-center">{item.maximo}</td>
                    <td className="px-6 py-4 text-center">{item.total_respuestas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EstadisticasGlobales;
