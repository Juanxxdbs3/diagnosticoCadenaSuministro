import express from "express";
import pool from "../db.js";
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todas las encuestas
router.get("/", protect, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM encuestas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener encuestas:", err);
    res.status(500).json({ error: "Error al obtener encuestas" });
  }
});

/*
// ANTES: router.get("/", async (req, res) => { ... });
// AHORA:
// Solo usuarios autenticados (cualquier rol) pueden ver las encuestas.
router.get("/", protect, async (req, res) => { ... });

// ANTES: router.post("/", async (req, res) => { ... });
// AHORA:
// Solo usuarios autenticados con rol 'admin' o 'evaluador' pueden crear encuestas.
router.post("/", protect, authorize('admin', 'evaluador'), async (req, res) => { ... });

*/


// Registrar nueva encuesta
router.post("/", protect, authorize('admin', 'evaluador'), async (req, res) => {
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
