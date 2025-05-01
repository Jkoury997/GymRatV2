const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Tu rol "${req.user.role}" no tiene permiso para realizar esta acción`
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
