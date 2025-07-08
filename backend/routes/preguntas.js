import express from "express";
import pool from "../db.js";
//import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener todas las preguntas de la encuesta
router.get("/preguntas/:id", async (req, res) => {
  const encuestaId = req.params.id;

  try {
    // Obtener todas las preguntas de la encuesta
    const preguntasResult = await pool.query(
      "SELECT * FROM preguntas WHERE encuesta_id = $1 ORDER BY id ASC",
      [encuestaId]
    );
    const preguntas = preguntasResult.rows;

    // Obtener opciones relacionadas con esas preguntas
    const preguntaIds = preguntas.map((p) => p.id);
    const opcionesResult = await pool.query(
      "SELECT * FROM opciones WHERE pregunta_id = ANY($1::int[]) ORDER BY id ASC",
      [preguntaIds]
    );
    const opciones = opcionesResult.rows;

    // Agrupar opciones por pregunta_id
    const opcionesPorPregunta = {};
    for (const opcion of opciones) {
      if (!opcionesPorPregunta[opcion.pregunta_id]) {
        opcionesPorPregunta[opcion.pregunta_id] = [];
      }
      opcionesPorPregunta[opcion.pregunta_id].push(opcion);
    }

    // Detectar preguntas tipo matriz para obtener sus items
    const matrizIds = preguntas
      .filter((p) => p.tipo === "matriz_escala" || p.tipo === "matriz_opcion_multiple")
      .map((p) => p.id);

    let itemsPorPregunta = {};
    if (matrizIds.length > 0) {
      const itemsResult = await pool.query(
        "SELECT * FROM items_matriz WHERE pregunta_id = ANY($1::int[]) ORDER BY id ASC",
        [matrizIds]
      );
      const items = itemsResult.rows;

      // Agrupar por pregunta_id
      for (const item of items) {
        if (!itemsPorPregunta[item.pregunta_id]) {
          itemsPorPregunta[item.pregunta_id] = [];
        }
        itemsPorPregunta[item.pregunta_id].push(item);
      }
    }

    // Armar estructura completa
    const preguntasConDatos = preguntas.map((pregunta) => ({
      ...pregunta,
      opciones: opcionesPorPregunta[pregunta.id] || [],
      items: (pregunta.tipo === "matriz_escala" || pregunta.tipo === "matriz_opcion_multiple")
        ? itemsPorPregunta[pregunta.id] || []
        : [],
    }));

    res.json(preguntasConDatos);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    res.status(500).json({ error: "Error al obtener preguntas" });
  }
});

// Registrar nuevas preguntas
router.post("/", async (req, res) => {
  const { encuestaId, claves } = req.body;

  try {
    const preguntaIds = [];

    for (let texto of claves) {
      const result = await pool.query(
        "INSERT INTO preguntas (encuesta_id, texto) VALUES ($1, $2) RETURNING id",
        [encuestaId, texto]
      );
      preguntaIds.push(result.rows[0].id);
    }

    res.status(201).json({ preguntaIds });
  } catch (err) {
    console.error("Error al insertar preguntas", err);
    res.status(500).json({ error: "Error al insertar preguntas" });
  }
});

export default router;