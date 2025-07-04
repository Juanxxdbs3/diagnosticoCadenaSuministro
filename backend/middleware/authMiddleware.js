/*Propósito: Contiene la lógica para proteger las rutas. Verifica que el token
 JWT sea válido y que el usuario tenga los permisos necesarios.
--------------------------------------------------------------------------------
*/
import jwt from 'jsonwebtoken';

// Middleware para proteger rutas verificando el token
export const protect = (req, res, next) => {
  let token;

  // El token se envía en el encabezado de autorización con el formato "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extraer el token del encabezado
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar la firma del token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Añadir los datos del usuario (decodificados del token) al objeto 'req'
      // para que las rutas posteriores tengan acceso a ellos.
      // ¡IMPORTANTE! No estamos incluyendo la contraseña.
      req.user = {
        id: decoded.id,
        rol: decoded.rol
      };

      next(); // El token es válido, continuar a la siguiente función (la ruta solicitada)
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó un token' });
  }
};

// Middleware para autorizar por rol
// Se usa DESPUÉS del middleware 'protect'
export const authorize = (...roles) => {
  return (req, res, next) => {
    // 'protect' ya debe haber añadido 'req.user'
    if (!req.user || !roles.includes(req.user.rol)) {
      // El rol del usuario no está en la lista de roles permitidos
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next(); // El usuario tiene el rol correcto, continuar.
  };
};