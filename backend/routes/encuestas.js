import express from "express";
import pool from "../db.js";

const router = express.Router();

// Obtener todas las encuestas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM encuestas ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener encuestas:", err);
    res.status(500).json({ error: "Error al obtener encuestas" });
  }
});

// Registrar nueva encuesta
router.post("/", async (req, res) => {
  const { titulo, sector } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO encuestas (titulo, sector) VALUES ($1, $2) RETURNING id",
      [titulo, sector]
    );
    console.log(result.rows[0]);
    const id = result.rows[0].id;
    res.status(201).json({ id }); // Devuelve el ID recién creado
  } catch (err) {
    console.error("Error al guardar encuesta:", err);
    res.status(500).json({ error: "Error al guardar encuesta" });
  }
});

export default router;
