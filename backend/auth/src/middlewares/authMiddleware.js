const jwtService = require('../services/jwtService');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token faltante' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwtService.verifyAccessToken(token);
    req.user = decoded; // Por ejemplo, { userId, role, ... }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { verifyToken };
