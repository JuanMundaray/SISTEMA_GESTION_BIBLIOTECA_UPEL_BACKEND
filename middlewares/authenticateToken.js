// middlewares/auth.js
const jwt = require('jsonwebtoken');

const publicRoutes = [
  { path: '/api/users/login', method: 'POST' },
  { path: '/', method: 'GET' }, // Ejemplo: Ruta raíz pública
];

const authMiddleware = (req, res, next) => {
  // Verifica si la ruta es pública
  const isPublic = publicRoutes.some(
    route => req.path === route.path && req.method === route.method || req.path.startsWith('/api-docs')
  );

  if (isPublic) {
    return next(); // Omite autenticación
  }

  // Verificación del token (para rutas protegidas)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = authMiddleware;