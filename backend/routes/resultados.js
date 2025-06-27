import express from "express";
import pool from "../db.js";

const router = express.Router();

// Endpoint principal para obtener los resultados consolidados de una empresa
router.get("/empresa/:empresaId", async (req, res) => {
    const { empresaId } = req.params;

    try {
        // Asumimos que empresaId corresponde a un usuario.
        // Primero, obtenemos el nombre de la empresa/usuario
        const infoEmpresa = await pool.query('SELECT nombre FROM usuarios WHERE id = $1', [empresaId]);
        const nombreEmpresa = infoEmpresa.rows.length > 0 ? infoEmpresa.rows[0].nombre : "Empresa Desconocida";

        // Segundo, obtenemos los resultados promediados por cada instrumento (encuesta)
        // Esta consulta es más compleja:
        // 1. Une encuestas, preguntas y respuestas.
        // 2. Filtra por las encuestas que pertenecen a la empresa (necesitarás una columna como 'empresa_id' en la tabla 'encuestas')
        // 3. Agrupa por encuesta para calcular el promedio de cada una.
        const resultadosPorInstrumento = await pool.query(`
            SELECT 
                e.id, 
                e.titulo, 
                AVG(CAST(r.valor AS NUMERIC)) as promedio
            FROM encuestas e
            JOIN preguntas p ON e.id = p.encuesta_id
            JOIN respuestas r ON p.pregunta_id = r.id
            -- IMPORTANTE: Debes tener una forma de asociar encuestas a una empresa.
            -- Esta línea asume que tienes una columna 'empresa_id' en tu tabla 'encuestas'.
            -- WHERE e.empresa_id = $1 
            GROUP BY e.id, e.titulo
            ORDER BY e.id;
        `); //, [empresaId]); // Descomenta esto cuando tengas la columna 'empresa_id'

        // Tercero, calculamos el promedio general de todos los promedios de los instrumentos
        let promedioTotal = 0;
        if (resultadosPorInstrumento.rows.length > 0) {
            const sumaDePromedios = resultadosPorInstrumento.rows.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0);
            promedioTotal = sumaDePromedios / resultadosPorInstrumento.rows.length;
        }

        // Estructuramos la respuesta como la espera el frontend
        const respuestaFinal = {
            nombreEmpresa: nombreEmpresa,
            evaluacionGeneral: {
                titulo: "Evaluación General de la Cadena de Suministro",
                promedioTotal: promedioTotal,
                resultadosPorInstrumento: resultadosPorInstrumento.rows.map(row => ({
                    id: row.id,
                    titulo: row.titulo,
                    promedio: parseFloat(row.promedio)
                }))
            },
            // El detalle de un instrumento específico lo puedes cargar aparte
            // para no sobrecargar esta llamada inicial.
            detalleInstrumento: null 
        };

        res.json(respuestaFinal);

    } catch (err) {
        console.error("Error al obtener resultados de la empresa:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// Obtener todos los sectores únicos
router.get("/sectores", async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT sector FROM usuarios WHERE sector IS NOT NULL');
    res.json(result.rows.map(r => r.sector));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sectores" });
  }
});

// Estadísticas globales con filtros por sector y tipo (deficiencia/fortaleza)
router.get("/stats/global", async (req, res) => {
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