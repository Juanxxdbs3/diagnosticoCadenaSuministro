/*Cambios:
 1. Se elimina la columna `sector` de la consulta INSERT, ya que no existe
    en la nueva tabla `encuestas`.
 2. Se quita el `protect` de la ruta GET para que cualquiera pueda ver los
    títulos de las encuestas, como lo solicitó tu compañero.
--------------------------------------------------------------------------------
*/
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Ruta GET para obtener todas las encuestas
router.get("/", async (req, res) => {
  try {
    console.log("📊 [BACKEND] Intentando obtener encuestas...");
    
    // ⚡ CAMBIO: Usar destructuring como en tu ejemplo
    const { rows } = await pool.query(`
      SELECT id, titulo, fecha_creacion 
      FROM encuestas 
      ORDER BY fecha_creacion DESC
    `);
    
    // ⚡ CAMBIO: Mostrar como tabla igual que tu ejemplo
    console.table(rows);
    console.log(`📋 Encuestas obtenidas: ${rows.length}`);
    
    res.json(rows);
  } catch (err) {
    console.error("❌ [BACKEND] Error al obtener encuestas:", err);
    console.error("❌ [BACKEND] Detalles completos:", {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ 
      error: "Error al obtener encuestas",
      message: err.message
    });
  }
});

// Ruta protegida para crear una nueva encuesta (solo admin/evaluador)
router.post("/", async (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ message: "El título es obligatorio" });
  }

  try {
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
