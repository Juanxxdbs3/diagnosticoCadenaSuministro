// Archivo a crear: backend/src/routes/stats.js
// Este nuevo archivo se encargará de las rutas de estadísticas complejas.

import express from "express";
import pool from "../db.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ⚡ PROTEGER: Solo usuarios logueados pueden ver estadísticas
router.use(protect);

/**
 * GET /api/stats/global - Solo admin y evaluador
 */
router.get("/global", authorize("admin", "evaluador"), async (req, res) => {
  try {
    console.log(`📊 [BACKEND] ${req.user.email} (${req.user.rol}) solicitando stats globales`);
    
    const result = await pool.query(`
      SELECT
        e.titulo                                    AS encuesta,
        COUNT(r.id)                                AS total_respuestas,
        COALESCE(ROUND(AVG(o.valor)::numeric, 2), 0)     AS promedio,
        COALESCE(ROUND(VAR_SAMP(o.valor)::numeric, 2), 0) AS varianza,
        COALESCE(ROUND(STDDEV_SAMP(o.valor)::numeric, 2), 0) AS desviacion_estandar
      FROM respuestas r
      JOIN preguntas p ON p.id = r.pregunta_id
      JOIN encuestas e ON e.id = p.encuesta_id
      JOIN opciones o ON o.id = r.opcion_id
      GROUP BY e.titulo
      ORDER BY e.titulo;
    `);

    console.log("✅ [BACKEND] Estadísticas globales obtenidas:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ [BACKEND] Error estadísticas globales:", err);
    res.status(500).json({ error: "Error al calcular estadísticas globales" });
  }
});

/**
 * GET /api/stats/empresa/:empresaId - Solo para la empresa específica
 */
router.get("/empresa/:empresaId", async (req, res) => {
  const empresaId = Number(req.params.empresaId);
  
  // Verificar que el usuario puede ver esta empresa
  if (req.user.rol === "empresa" && req.user.id !== empresaId) {
    return res.status(403).json({ error: "Solo puedes ver tus propias estadísticas" });
  }

  try {
    console.log(`📊 [BACKEND] ${req.user.email} solicitando stats de empresa ${empresaId}`);
    
    const result = await pool.query(`
      SELECT
        e.titulo                                    AS encuesta,
        COUNT(r.id)                                AS total_respuestas,
        COALESCE(ROUND(AVG(o.valor)::numeric, 2), 0)     AS promedio,
        COALESCE(ROUND(VAR_SAMP(o.valor)::numeric, 2), 0) AS varianza,
        COALESCE(ROUND(STDDEV_SAMP(o.valor)::numeric, 2), 0) AS desviacion_estandar
      FROM respuestas r
      JOIN preguntas p ON p.id = r.pregunta_id
      JOIN encuestas e ON e.id = p.encuesta_id
      JOIN opciones o ON o.id = r.opcion_id
      JOIN encuestados enc ON enc.id = r.encuestado_id
      WHERE enc.empresa_id = $1
      GROUP BY e.titulo
      ORDER BY e.titulo;
    `, [empresaId]);

    console.log(`✅ [BACKEND] Stats empresa ${empresaId} obtenidas:`, result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ [BACKEND] Error stats empresa:", err);
    res.status(500).json({ error: "Error al calcular estadísticas de empresa" });
  }
});

/**
 * GET /api/stats/encuesta/:encuestaId
 */
router.get("/encuesta/:encuestaId", authorize("admin", "evaluador"), async (req, res) => {
  const encuestaId = Number(req.params.encuestaId);
  console.log("📊 [BACKEND] Obteniendo stats para encuesta:", encuestaId);

  if (isNaN(encuestaId)) {
    return res.status(400).json({ error: "ID de encuesta inválido" });
  }

  try {
    // Estadísticas por pregunta
    const q = await pool.query(`
      SELECT
        p.id               AS "questionId",
        p.texto            AS "questionText",
        COALESCE(ROUND(AVG(o.valor)::numeric, 2), 0)     AS "avgScore",
        COALESCE(ROUND(VAR_SAMP(o.valor)::numeric, 2), 0) AS "variance",
        COALESCE(ROUND(STDDEV_SAMP(o.valor)::numeric, 2), 0) AS "stddev"
      FROM respuestas r
      JOIN preguntas p ON p.id = r.pregunta_id
      JOIN opciones o ON o.id = r.opcion_id
      WHERE p.encuesta_id = $1
      GROUP BY p.id, p.texto
      ORDER BY p.id;
    `, [encuestaId]);

    console.log("📊 [BACKEND] Stats por pregunta:", q.rows);

    // Estadísticas generales
    const overall = await pool.query(`
      SELECT
        COALESCE(ROUND(AVG(o.valor)::numeric, 2), 0)     AS "overallAvg",
        COALESCE(ROUND(VAR_SAMP(o.valor)::numeric, 2), 0) AS "overallVariance",
        COALESCE(ROUND(STDDEV_SAMP(o.valor)::numeric, 2), 0) AS "overallStddev"
      FROM respuestas r
      JOIN preguntas p ON p.id = r.pregunta_id
      JOIN opciones o ON o.id = r.opcion_id
      WHERE p.encuesta_id = $1;
    `, [encuestaId]);

    console.log("📊 [BACKEND] Stats generales:", overall.rows);

    const avg = Number(overall.rows[0]?.overallAvg) || 0;
    const status = avg < 2 ? 'deficiente' : avg > 4 ? 'fortaleza' : 'normal';

    const response = {
      questionStats: q.rows || [],
      overall: {
        overallAvg: avg,
        overallVariance: Number(overall.rows[0]?.overallVariance) || 0,
        overallStddev: Number(overall.rows[0]?.overallStddev) || 0,
        status
      }
    };

    console.log("✅ [BACKEND] Enviando respuesta:", response);
    res.json(response);
  } catch (err) {
    console.error("❌ [BACKEND] Error stats por encuesta:", err);
    res.status(500).json({ error: "Error al calcular estadísticas de encuesta" });
  }
});

export default router;
