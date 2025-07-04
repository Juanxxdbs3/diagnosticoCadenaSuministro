import express from "express";
import pool from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/login
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Por favor, proporciona email y contraseña" });
  }

  try {
    // 1. Buscar al usuario por su email
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    // Si no se encuentra ningún usuario con ese email
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = result.rows[0];

    // 2. Comparar la contraseña proporcionada con la hasheada en la BD
    // Esta es la corrección clave. Nos aseguramos de que user.password existe.
    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      // Si la contraseña no coincide
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // 3. Si las credenciales son correctas, generar el token JWT
    const payload = {
      id: user.id,
      rol: user.rol,
      nombre: user.nombre
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // El token expirará en 1 día
    );

    // 4. Enviar el token y los datos del usuario (sin la contraseña)
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;