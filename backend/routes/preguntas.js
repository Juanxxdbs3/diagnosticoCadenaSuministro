import express from "express";
import pool from "../db.js";

const router = express.Router();

// Obtener todas las preguntas de la encuesta
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM preguntas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener encuestas:", err);
    res.status(500).json({ error: "Error al obtener encuestas" });
  }
});

// Registrar nuevas preguntas
router.post("/", async (req, res) => {
  const { encuestaId, claves} = req.body;

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