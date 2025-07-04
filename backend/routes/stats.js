// Archivo a crear: backend/src/routes/stats.js
// Este nuevo archivo se encargará de las rutas de estadísticas complejas.

import express from "express";
import pool from "../db.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/stats/global
 * Estadísticas agregadas globales de todas las encuestas (por título).
 */
router.get("/global", protect, authorize('admin', 'evaluador'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.titulo                      AS encuesta,
        COUNT(r.id)                  AS total_respuestas,
        ROUND(AVG(r.valor)::numeric, 2)     AS promedio,
        ROUND(VAR_SAMP(r.valor)::numeric, 2) AS varianza,
        ROUND(STDDEV_SAMP(r.valor)::numeric, 2) AS desviacion_estandar
      FROM respuestas r
      JOIN preguntas p  ON p.id = r.pregunta_id
      JOIN encuestas e  ON e.id = p.encuesta_id
      GROUP BY e.titulo
      ORDER BY e.titulo;
    `);

    const formatted = result.rows.map(row => ({
      encuesta: row.encuesta,
      total_respuestas: Number(row.total_respuestas),
      promedio:           Number(row.promedio)           || 0,
      varianza:           Number(row.varianza)           || 0,
      desviacion_estandar: Number(row.desviacion_estandar) || 0
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error estadísticas globales:", err);
    res.status(500).json({ error: "Error al calcular estadísticas globales" });
  }
});

/**
 * GET /api/stats/encuesta/:encuestaId
 * Estadísticas detalladas por pregunta de una encuesta concreta.
 */
router.get("/encuesta/:encuestaId", protect, async (req, res) => {
  const encuestaId = Number(req.params.encuestaId);
  if (isNaN(encuestaId)) {
    return res.status(400).json({ error: "ID de encuesta inválido" });
  }

  try {
    // 1. Obtener el id de la empresa dueña de la encuesta
    const encuestaInfo = await pool.query(
      `SELECT empresa_id FROM encuestas WHERE id = $1`,
      [encuestaId]
    );
    if (encuestaInfo.rows.length === 0) {
      return res.status(404).json({ error: "Encuesta no encontrada" });
    }
    const empresaId = encuestaInfo.rows[0].empresa_id;

    // 2. Permitir acceso solo si:
    // - Es admin o evaluador
    // - O es empresa y es la dueña de la encuesta
    const user = req.user;
    if (
      user.rol !== 'admin' &&
      user.rol !== 'evaluador' &&
      !(user.rol === 'empresa' && String(user.id) === String(empresaId))
    ) {
      return res.status(403).json({ error: "No autorizado para ver estadísticas de esta encuesta" });
    }

    // 3. Obtener estadísticas (igual que antes)
    const q = await pool.query(`
      SELECT
        p.id               AS questionId,
        p.texto            AS questionText,
        ROUND(AVG(r.valor)::numeric, 2)     AS avgScore,
        ROUND(VAR_SAMP(r.valor)::numeric, 2) AS variance,
        ROUND(STDDEV_SAMP(r.valor)::numeric, 2) AS stddev
      FROM respuestas r
      JOIN preguntas p ON p.id = r.pregunta_id
      WHERE p.encuesta_id = $1
      GROUP BY p.id, p.texto
      ORDER BY p.id;
    `, [encuestaId]);

    const overall = await pool.query(`
      SELECT
        ROUND(AVG(r.valor)::numeric, 2)     AS overallAvg,
        ROUND(VAR_SAMP(r.valor)::numeric, 2) AS overallVariance,
        ROUND(STDDEV_SAMP(r.valor)::numeric, 2) AS overallStddev
      FROM respuestas r
      JOIN preguntas p ON p.id = r.pregunta_id
      WHERE p.encuesta_id = $1;
    `, [encuestaId]);

    // 4. Si no hay respuestas, devolver datos en cero
    const avg = Number(overall.rows[0]?.overallavg) || 0;
    const status = avg < 2  ? 'deficiente'
                 : avg > 4  ? 'fortaleza'
                 : 'normal';

    res.json({
      questionStats: q.rows || [],
      overall: {
        overallAvg:      avg,
        overallVariance: Number(overall.rows[0]?.overallvariance) || 0,
        overallStddev:   Number(overall.rows[0]?.overallstddev)   || 0,
        status
      }
    });
  } catch (err) {
    console.error("Error stats por encuesta:", err);
    res.status(500).json({ error: "Error al calcular estadísticas de encuesta" });
  }
});

export default router;
