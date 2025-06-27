// Archivo a crear: backend/src/routes/stats.js
// Este nuevo archivo se encargará de las rutas de estadísticas complejas.

import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/stats/global
// Devuelve las estadísticas agregadas para cada tipo de instrumento (encuesta)
// a través de todas las empresas.
router.get("/global", async (req, res) => {
  try {
    // Esta consulta es el corazón de la nueva funcionalidad.
    // Para cada tipo de encuesta (agrupado por título), calcula:
    // - total_respuestas: Cuántas veces se ha respondido en total.
    // - promedio: La puntuación media.
    // - desviacion_estandar: Mide la dispersión de las respuestas. Un valor bajo
    //   significa que la mayoría de las empresas puntuaron de forma similar.
    // - varianza: Es la desviación estándar al cuadrado.
    // - minimo y maximo: Los puntajes más bajo y más alto registrados.
    const statsQuery = `
      SELECT 
        e.titulo,
        COUNT(r.id) AS total_respuestas,
        AVG(CAST(r.valor AS NUMERIC)) AS promedio,
        STDDEV_SAMP(CAST(r.valor AS NUMERIC)) AS desviacion_estandar,
        VAR_SAMP(CAST(r.valor AS NUMERIC)) AS varianza,
        MIN(CAST(r.valor AS NUMERIC)) AS minimo,
        MAX(CAST(r.valor AS NUMERIC)) AS maximo
      FROM encuestas e
      JOIN preguntas p ON e.id = p.encuesta_id
      JOIN respuestas r ON p.id = r.pregunta_id
      GROUP BY e.titulo
      ORDER BY e.titulo;
    `;

    const result = await pool.query(statsQuery);

    // Formateamos los números para que sean más legibles en el frontend
    const formattedResults = result.rows.map(row => ({
      ...row,
      promedio: parseFloat(row.promedio || 0).toFixed(2),
      desviacion_estandar: parseFloat(row.desviacion_estandar || 0).toFixed(2),
      varianza: parseFloat(row.varianza || 0).toFixed(2),
    }));

    res.json(formattedResults);

  } catch (err) {
    console.error("Error al obtener estadísticas globales:", err);
    res.status(500).json({ error: "Error del servidor al calcular estadísticas globales" });
  }
});

export default router;
