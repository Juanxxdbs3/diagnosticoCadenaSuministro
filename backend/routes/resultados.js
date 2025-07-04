/*Propósito: Este es el cerebro para calcular los resultados de un encuestado.
 La nueva consulta SQL es compleja porque une múltiples tablas de respuestas
 para darte el promedio por cada uno de los 13 instrumentos.
--------------------------------------------------------------------------------
*/
import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/resultados/encuestado/:encuestadoId
// Devuelve los resultados consolidados para un solo encuestado.
router.get("/encuestado/:encuestadoId", async (req, res) => {
    const { encuestadoId } = req.params;

    try {
        // Primero, obtenemos el nombre del encuestado
        const infoEncuestado = await pool.query('SELECT nombre_encuestado FROM encuestados WHERE id = $1', [encuestadoId]);
        const nombreEncuestado = infoEncuestado.rows.length > 0 ? infoEncuestado.rows[0].nombre_encuestado : "Usuario Desconocido";

        // Segundo, la consulta para agregar todos los resultados
        const query = `
            SELECT
                encuesta_id,
                encuesta_titulo,
                AVG(valor_respuesta) AS promedio
            FROM (
                -- Respuestas de opción simple y escala
                SELECT
                    p.encuesta_id,
                    e.titulo AS encuesta_titulo,
                    o.valor AS valor_respuesta
                FROM respuestas r
                JOIN opciones o ON r.opcion_id = o.id
                JOIN preguntas p ON r.pregunta_id = p.id
                JOIN encuestas e ON p.encuesta_id = e.id
                WHERE r.encuestado_id = $1 AND o.valor IS NOT NULL

                UNION ALL

                -- Respuestas de matriz de escala
                SELECT
                    p.encuesta_id,
                    e.titulo AS encuesta_titulo,
                    o.valor AS valor_respuesta
                FROM respuestas_matriz rm
                JOIN opciones o ON rm.opcion_id = o.id
                JOIN items_matriz im ON rm.item_matriz_id = im.id
                JOIN preguntas p ON im.pregunta_id = p.id
                JOIN encuestas e ON p.encuesta_id = e.id
                WHERE rm.encuestado_id = $1 AND o.valor IS NOT NULL
                
                UNION ALL

                -- Respuestas de matriz de opción múltiple (si también usan 'valor')
                SELECT
                    p.encuesta_id,
                    e.titulo AS encuesta_titulo,
                    o.valor AS valor_respuesta
                FROM respuestas_matriz_multiple rmm
                JOIN opciones o ON rmm.opcion_id = o.id
                JOIN items_matriz im ON rmm.item_matriz_id = im.id
                JOIN preguntas p ON im.pregunta_id = p.id
                JOIN encuestas e ON p.encuesta_id = e.id
                WHERE rmm.encuestado_id = $1 AND o.valor IS NOT NULL

            ) AS todas_las_respuestas
            GROUP BY encuesta_id, encuesta_titulo
            ORDER BY encuesta_id;
        `;

        const resultadosPorInstrumento = await pool.query(query, [encuestadoId]);

        // Tercero, calculamos el promedio general
        let promedioTotal = 0;
        if (resultadosPorInstrumento.rows.length > 0) {
            const sumaDePromedios = resultadosPorInstrumento.rows.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0);
            promedioTotal = sumaDePromedios / resultadosPorInstrumento.rows.length;
        }

        // Estructuramos la respuesta como la espera el frontend
        const respuestaFinal = {
            nombreEncuestado: nombreEncuestado,
            evaluacionGeneral: {
                titulo: "Evaluación General de la Cadena de Suministro",
                promedioTotal: promedioTotal,
                resultadosPorInstrumento: resultadosPorInstrumento.rows.map(row => ({
                    id: row.encuesta_id,
                    titulo: row.encuesta_titulo,
                    promedio: parseFloat(row.promedio)
                }))
            }
        };

        res.json(respuestaFinal);

    } catch (err) {
        console.error("Error al obtener resultados del encuestado:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

export default router;