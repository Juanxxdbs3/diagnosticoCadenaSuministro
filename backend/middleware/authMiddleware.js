/*Propósito: Contiene la lógica para proteger las rutas. Verifica que el token
 JWT sea válido y que el usuario tenga los permisos necesarios.
--------------------------------------------------------------------------------
*/
import jwt from "jsonwebtoken";
import pool from "../db.js";

// Middleware para verificar token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer token
      token = req.headers.authorization.split(" ")[1];
      
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar usuario
      const result = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE id = $1", [decoded.id]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Token inválido" });
      }
      
      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error("Error en protect middleware:", error);
      return res.status(401).json({ message: "Token inválido" });
    }
  } else {
    return res.status(401).json({ message: "No hay token, acceso denegado" });
  }
};

// Middleware para verificar roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: `Acceso denegado. Se requiere rol: ${roles.join(" o ")}` });
    }

    next();
  };
};

// Middleware opcional (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE id = $1", [decoded.id]);
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (error) {
      // Ignorar errores, continuar sin usuario
    }
  }
  next();
};