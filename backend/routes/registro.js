import express from "express";
import pool from "../db.js";
import bcrypt from 'bcryptjs';
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registrar nuevo usuario (solo admin)
router.post("/", protect, authorize('admin'), async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado" });
    }

    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar el nuevo usuario con la contraseña hasheada
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol",
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Error en el registro:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;