import api from "../api/axios";

/**
 * Obtener estadísticas globales
 */
export function fetchGlobalStats(params = {}) {
  console.log("🌐 [FRONTEND] Llamando a:", `/stats/global`);
  // ⚡ CAMBIO: Quitar /api porque ya está en baseURL
  return api.get(`/stats/global`, { params })
    .then(response => {
      console.log("✅ [FRONTEND] Respuesta completa:", response);
      console.log("📊 [FRONTEND] Datos recibidos:", response.data);
      return response;
    })
    .catch(error => {
      console.error("❌ [FRONTEND] Error en fetchGlobalStats:", error);
      console.error("❌ [FRONTEND] Error response:", error.response);
      throw error;
    });
}

/**
 * Obtener estadísticas detalladas de una encuesta concreta
 * @param {number} encuestaId
 */
export function fetchEncuestaStats(encuestaId) {
  console.log("🌐 [FRONTEND] Llamando a:", `/stats/encuesta/${encuestaId}`);
  // ⚡ CAMBIO: Quitar /api porque ya está en baseURL
  return api.get(`/stats/encuesta/${encuestaId}`)
    .then(response => {
      console.log("✅ [FRONTEND] Respuesta completa:", response);
      console.log("📊 [FRONTEND] Datos recibidos:", response.data);
      return response;
    })
    .catch(error => {
      console.error("❌ [FRONTEND] Error en fetchEncuestaStats:", error);
      console.error("❌ [FRONTEND] Error response:", error.response);
      throw error;
    });
}