import express from "express";
import pool from "../db.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registro abierto
router.post("/", async (req, res) => {
  const { id, nombre, email, password, rol } = req.body;

  if (!id || !nombre || !email || !password || !rol) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "La cédula o NIT ya está registrado" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar el usuario
    const result = await pool.query(
      "INSERT INTO usuarios (id, nombre, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, rol",
      [id, nombre, email, hashedPassword, rol]
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
