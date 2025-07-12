import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// POST /api/login
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Por favor, proporciona email y contraseña" });
  }

  try {
    console.log("🔐 [BACKEND] Intento de login para:", email);
    
    // Buscar usuario por email
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      console.log("❌ [BACKEND] Usuario no encontrado:", email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = result.rows[0];
    console.log("✅ [BACKEND] Usuario encontrado:", user.email, "Rol:", user.rol);

    // ⚡ CAMBIO: Comparación flexible de contraseñas
    let isMatch = false;
    
    // Si la contraseña está hasheada (empieza con $2b$)
    if (user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
      console.log("🔓 [BACKEND] Comparando contraseña hasheada:", isMatch);
    } else {
      // Si es contraseña simple (para testing)
      isMatch = password === user.password;
      console.log("🔓 [BACKEND] Comparando contraseña simple:", isMatch);
    }

    if (!isMatch) {
      console.log("❌ [BACKEND] Contraseña incorrecta");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // ⚡ VERIFICAR: que JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
      console.error("❌ [BACKEND] JWT_SECRET no está definido en .env");
      return res.status(500).json({ error: "Error de configuración del servidor" });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ [BACKEND] Token generado exitosamente");
    console.log("🚀 [BACKEND] Login exitoso para:", user.email);

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error("❌ [BACKEND] Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;