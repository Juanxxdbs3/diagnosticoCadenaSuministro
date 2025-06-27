import express from "express";
import pool from "../db.js";

const router = express.Router();

// Registrar nuevo usuario
router.post("/", async (req, res) => {
  const { id, nombre, email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO usuarios (id, nombre, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, nombre, email, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error("Error al guardar usuario:", err);
    res.status(500).json({ error: "Error al guardar usuario" });
  }
});

export default router;