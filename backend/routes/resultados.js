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

export default router;