import api from "../api/axios";

export const cargarEncuestas = async () => {
  try {
    console.log("🔍 [FRONTEND] Solicitando encuestas...");
    
    const res = await api.get("/encuestas");
    
    console.log("✅ [FRONTEND] Encuestas recibidas:", res.data);
    console.log("📋 [FRONTEND] Cantidad:", res.data.length);
    return res.data;
  } catch (err) {
    console.error("❌ [FRONTEND] Error al cargar encuestas:", err);
    console.error("❌ [FRONTEND] Detalles completos:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      url: err.config?.url
    });
    return [];
  }
};

export const cargarPreguntas = async (id) => {
  try {
    console.log("🔍 [FRONTEND] Solicitando preguntas para encuesta:", id);
    
    const res = await api.get('/preguntas', {
      params: { id }
    });
    
    console.log("✅ [FRONTEND] Preguntas recibidas:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [FRONTEND] Error al cargar preguntas:", err);
    console.error("❌ [FRONTEND] Detalles:", err.response?.data || err.message);
    return [];
  }
};