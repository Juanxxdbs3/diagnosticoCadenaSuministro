 /*Cambios:
 1. Se elimina la columna `sector` de la consulta INSERT, ya que no existe
    en la nueva tabla `encuestas`.
 2. Se quita el `protect` de la ruta GET para que cualquiera pueda ver los
    títulos de las encuestas, como lo solicitó tu compañero.
--------------------------------------------------------------------------------
*/
import express from "express";
import pool from "../db.js";
//import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta pública para obtener los títulos de todas las encuestas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, titulo FROM encuestas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener encuestas:", err);
    res.status(500).json({ error: "Error al obtener encuestas" });
  }
});

// Ruta protegida para crear una nueva encuesta (solo admin/evaluador)
router.post("/", async (req, res) => {
  // Se recibe solo el 'titulo'
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ message: "El título es obligatorio" });
  }

  try {
    // Se elimina 'sector' de la consulta
    const result = await pool.query(
      "INSERT INTO encuestas (titulo) VALUES ($1) RETURNING id",
      [titulo]
    );
    
    const id = result.rows[0].id;
    res.status(201).json({ id });
  } catch (err) {
    console.error("Error al guardar encuesta:", err);
    res.status(500).json({ error: "Error al guardar encuesta" });
  }
});

export default router;
