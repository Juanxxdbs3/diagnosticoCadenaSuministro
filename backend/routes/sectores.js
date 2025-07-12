import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/sectores
 * Obtener todos los sectores únicos de encuestados
 */
router.get("/", async (req, res) => {
  try {
    console.log("📊 [BACKEND] Obteniendo sectores únicos...");
    
    const result = await pool.query(`
      SELECT DISTINCT sector 
      FROM encuestados 
      WHERE sector IS NOT NULL AND sector != ''
      ORDER BY sector ASC
    `);
    
    const sectores = result.rows.map(row => row.sector);
    
    console.log("✅ [BACKEND] Sectores obtenidos:", sectores);
    res.json(sectores);
  } catch (err) {
    console.error("❌ [BACKEND] Error obteniendo sectores:", err);
    res.status(500).json({ error: "Error al obtener sectores" });
  }
});

export default router;