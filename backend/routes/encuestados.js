import express from "express";
import pool from "../db.js";

const router = express.Router();

// POST /api/encuestados
router.post("/encuestados", async (req, res) => {
  const { empresaId, sector, nombreEncuestado, email, telefono } = req.body;

  if (!empresaId || !sector || !nombreEncuestado || !email || !telefono) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO encuestados (empresa_id, sector, nombre_encuestado, email, telefono)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [empresaId, sector, nombreEncuestado, email, telefono]
    );

    res.status(201).json({ encuestado_id: result.rows[0].id });
  } catch (error) {
    console.error("Error al registrar encuestado:", error);
    res.status(500).json({ error: "Error al registrar encuestado." });
  }
});

export default router;