import express from "express";
import pool from "../db.js";

const router = express.Router();

// POST /api/respuestas
router.post("/", async (req, res) => {
  const { encuestado_id, respuestas } = req.body;

  if (!encuestado_id || !Array.isArray(respuestas)) {
    return res.status(400).json({ error: "Datos incompletos para guardar respuestas." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const r of respuestas) {
      const { pregunta_id, texto, opcion_id = null } = r;

      await client.query(
        `INSERT INTO respuestas (encuestado_id, pregunta_id, texto, opcion_id, fecha_respuesta)
         VALUES ($1, $2, $3, $4, NOW())`,
        [encuestado_id, pregunta_id, texto, opcion_id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ mensaje: "Respuestas guardadas correctamente." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al guardar respuestas:", error);
    res.status(500).json({ error: "Error al guardar respuestas." });
  } finally {
    client.release();
  }
});

// === NUEVOS ENDPOINTS DE ESTADÍSTICAS ===

// 1. Estadísticas generales de una encuesta (instrumento)
router.get("/stats/:encuestaId", async (req, res) => {
  const { encuestaId } = req.params;
  try {
    const statsPorPregunta = await pool.query(`
      SELECT 
        p.id as pregunta_id,
        p.texto as pregunta_texto,
        COUNT(r.id) as total_respuestas,
        -- Aseguramos que el valor sea numérico antes de promediar
        AVG(CAST(r.valor AS NUMERIC)) as promedio_numerico
      FROM preguntas p
      LEFT JOIN respuestas r ON p.id = r.pregunta_id
      WHERE p.encuesta_id = $1
      GROUP BY p.id, p.texto
      ORDER BY p.id;
    `, [encuestaId]);

    const promedioGeneral = await pool.query(`
        SELECT AVG(CAST(r.valor AS NUMERIC)) as promedio_general
        FROM respuestas r
        JOIN preguntas p ON r.pregunta_id = p.id
        WHERE p.encuesta_id = $1;
    `, [encuestaId]);

    res.json({
      encuesta_id: encuestaId,
      promedio_general: parseFloat(promedioGeneral.rows[0].promedio_general || 0).toFixed(2),
      estadisticas_por_pregunta: statsPorPregunta.rows
    });
  } catch (err) {
    console.error("Error al obtener estadísticas de la encuesta:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// 2. Estadísticas de una pregunta específica
router.get("/stats/pregunta/:preguntaId", async (req, res) => {
    const { preguntaId } = req.params;
    try {
        const stats = await pool.query(`
            SELECT 
                COUNT(id) as total_respuestas,
                AVG(CAST(valor AS NUMERIC)) as promedio,
                MIN(CAST(valor AS NUMERIC)) as minimo,
                MAX(CAST(valor AS NUMERIC)) as maximo,
                MODE() WITHIN GROUP (ORDER BY CAST(valor AS NUMERIC)) as moda
            FROM respuestas
            WHERE pregunta_id = $1;
        `, [preguntaId]);

        res.json(stats.rows[0]);
    } catch (err) {
        console.error("Error al obtener estadísticas de la pregunta:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});


// 3. Generar datos de prueba (muy útil para desarrollo)
router.post("/generar-datos-prueba/:encuestaId", async (req, res) => {
    const { encuestaId } = req.params;
    const { cantidad = 5 } = req.body; // Genera 5 respuestas por pregunta por defecto
    
    try {
        const preguntas = await pool.query('SELECT id FROM preguntas WHERE encuesta_id = $1', [encuestaId]);
        if (preguntas.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron preguntas para esta encuesta." });
        }

        let respuestasGeneradas = 0;
        for (const pregunta of preguntas.rows) {
            for (let i = 0; i < cantidad; i++) {
                // Genera un número aleatorio entre 1 y 5
                const valorAleatorio = Math.floor(Math.random() * 5) + 1;
                await pool.query(
                    'INSERT INTO respuestas (valor, pregunta_id) VALUES ($1, $2)',
                    [valorAleatorio, pregunta.id]
                );
                respuestasGeneradas++;
            }
        }

        res.status(201).json({ 
            message: `Se generaron ${respuestasGeneradas} respuestas de prueba para la encuesta ${encuestaId}.`
        });
    } catch (err) {
        console.error("Error al generar datos de prueba:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

export default router;