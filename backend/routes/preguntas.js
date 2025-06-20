import express from "express";
import pool from "../db.js";

const router = express.Router();

// Registrar nuevas preguntas
router.post("/", async (req, res) => {
  const { claves, encuestaId } = req.body;

  try {
    const preguntaIds = [];

    for (let texto of claves) {
      const result = await pool.query(
        "INSERT INTO preguntas (texto, encuesta_id) VALUES ($1, $2) RETURNING id",
        [texto, encuestaId]
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