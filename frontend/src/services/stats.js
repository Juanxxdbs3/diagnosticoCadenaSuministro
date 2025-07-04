import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtener estadísticas globales de todas las encuestas, con filtros opcionales
 * @param {Object} params - { sector, tipo }
 */
export function fetchGlobalStats(params = {}) {
  return axios.get(`${API}/api/stats/global`, { params });
}

/**
 * Obtener estadísticas detalladas de una encuesta concreta
 * @param {number} encuestaId
 */
export function fetchEncuestaStats(encuestaId) {
  return axios.get(`${API}/api/stats/encuesta/${encuestaId}`);
} 