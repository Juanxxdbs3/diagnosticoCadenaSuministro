/*Cambios:
 1. Se elimina el campo `id` del INSERT, ya que la base de datos lo genera
    automáticamente.
 2. Se ajusta la verificación de existencia de usuario para que use `email`
    en lugar de `id`, ya que el email debe ser único.
--------------------------------------------------------------------------------
*/
import express from "express";
import pool from "../db.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post("/", async (req, res) => {
  // El 'id' ya no se recibe desde el frontend
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificamos si el email ya está en uso, que es un identificador único
    const userExists = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Eliminamos 'id' de la consulta INSERT
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol",
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Error en el registro:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
