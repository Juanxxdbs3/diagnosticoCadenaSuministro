import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { id, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1 AND password = $2",
      [id, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

export default router;
