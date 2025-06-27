import express from "express";
import pool from "../db.js";

const router = express.Router();

// Endpoint principal para obtener los resultados consolidados de una empresa
router.get("/encuestado/:encuestadoId", async (req, res) => {
  const { encuestadoId } = req.params;

  try {
    // Obtener nombre del encuestado
    const usuarioResult = await pool.query(
      "SELECT nombre FROM usuarios WHERE id = $1",
      [encuestadoId]
    );

    const nombreEncuestado = usuarioResult.rows[0]?.nombre || "Usuario desconocido";

    // Obtener promedio por encuesta usando respuestas y opciones
    const resultadosResult = await pool.query(`
      SELECT 
        e.id AS encuesta_id,
        e.titulo,
        AVG(o.valor) AS promedio
      FROM respuestas r
      JOIN preguntas p ON r.pregunta_id = p.id
      JOIN encuestas e ON p.encuesta_id = e.id
      JOIN opciones o ON r.opcion_id = o.id
      WHERE r.encuestado_id = $1 AND o.valor IS NOT NULL
      GROUP BY e.id, e.titulo
      ORDER BY e.id
    `, [encuestadoId]);

    const resultados = resultadosResult.rows;

    // Calcular promedio general
    const promedioTotal = resultados.length
      ? resultados.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0) / resultados.length
      : 0;

    const respuesta = {
      nombreEncuestado,
      evaluacionGeneral: {
        titulo: "Evaluación General de la Cadena de Suministro",
        promedioTotal,
        resultadosPorInstrumento: resultados.map(r => ({
          id: r.encuesta_id,
          titulo: r.titulo,
          promedio: parseFloat(r.promedio)
        }))
      },
      detalleInstrumento: null // Se puede implementar como otro endpoint
    };

    res.json(respuesta);
  } catch (error) {
    console.error("Error al obtener resultados del encuestado:", error);
    res.status(500).json({ error: "Error al obtener resultados del encuestado" });
  }
});

export default router;