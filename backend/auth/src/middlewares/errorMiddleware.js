const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
module.exports = { errorHandler };