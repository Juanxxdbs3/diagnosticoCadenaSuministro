import express from "express";
import pool from "../db.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ver resultados de una empresa (solo esa empresa, admin o evaluador)
router.get("/encuestado/:encuestadoId", protect, async (req, res) => {
  const { encuestadoId } = req.params;
  const user = req.user;

  // Permitir si es admin/evaluador o si es la propia empresa
  if (
    user.rol !== 'admin' &&
    user.rol !== 'evaluador' &&
    !(user.rol === 'empresa' && String(user.id) === String(encuestadoId))
  ) {
    return res.status(403).json({ error: "No autorizado para ver estos resultados" });
  }

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

// Obtener todos los sectores únicos (solo autenticados)
router.get("/sectores", protect, async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT sector FROM usuarios WHERE sector IS NOT NULL');
    res.json(result.rows.map(r => r.sector));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sectores" });
  }
});

// Estadísticas globales (solo admin/evaluador)
router.get("/stats/global", protect, authorize('admin', 'evaluador'), async (req, res) => {
  const { sector, tipo } = req.query;
  let params = [];
  let whereSector = '';
  let havingTipo = '';

  if (sector) {
    whereSector = 'AND u.sector = $1';
    params.push(sector);
  }

  if (tipo === 'deficiencia') {
    havingTipo = 'HAVING AVG(CAST(r.valor AS NUMERIC)) < 2';
  } else if (tipo === 'fortaleza') {
    havingTipo = 'HAVING AVG(CAST(r.valor AS NUMERIC)) > 4';
  }

  const query = `
    SELECT 
      e.id as instrumento_id,
      e.titulo as instrumento_titulo,
      AVG(CAST(r.valor AS NUMERIC)) as promedio,
      STDDEV_POP(CAST(r.valor AS NUMERIC)) as desviacion_estandar,
      VAR_POP(CAST(r.valor AS NUMERIC)) as varianza,
      MIN(CAST(r.valor AS NUMERIC)) as minimo,
      MAX(CAST(r.valor AS NUMERIC)) as maximo,
      COUNT(r.id) as total_respuestas
    FROM encuestas e
    JOIN preguntas p ON e.id = p.encuesta_id
    JOIN respuestas r ON p.id = r.pregunta_id
    JOIN usuarios u ON e.empresa_id = u.id
    WHERE 1=1
      ${whereSector}
    GROUP BY e.id, e.titulo
    ${havingTipo}
    ORDER BY e.id;
  `;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener estadísticas globales" });
  }
});

export default router;