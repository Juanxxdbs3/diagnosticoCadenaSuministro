import express from "express";
import pool from "../db.js";

const router = express.Router();

// Registrar nuevas preguntas
router.post("/", async (req, res) => {
  const { valores, preguntaIds } = req.body;

  try {
    for (let i = 0; i < preguntaIds.length; i++) {
      const preguntaId = preguntaIds[i];

      for (let j = 0; j < valores.length; j++) {
        const respuesta = valores[j][i]; // Fila j, columna i
        await pool.query(
          "INSERT INTO respuestas (valor, pregunta_id) VALUES ($1, $2)",
          [respuesta, preguntaId]
        );
      }
    }

    res.status(201).json({ message: "Respuestas registradas correctamente" });
  } catch (err) {
    console.error("Error al insertar respuestas", err);
    res.status(500).json({ error: "Error al insertar respuestas" });
  }
});

export default router;