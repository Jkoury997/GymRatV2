// src/services/jwtService.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Role = require('../database/models/Role'); // Asegúrate de la ruta correcta según tu estructura
dotenv.config();

/**
 * Genera un Access Token con una validez de 1 hora.
 * @param {String} userId - El ID del usuario.
 * @param {String} role - El rol del usuario.
 * @returns {String} Access Token
 */
const generateAccessToken = async (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  
  // Obtener el rol del usuario desde la tabla de roles
  const roleRecord = await Role.findOne({ userId });
  const role = roleRecord ? roleRecord.role : 'user'; // O define un rol por defecto
  
  return jwt.sign({ userId, role }, secret, { expiresIn: '1h' });
};

/**
 * Genera un Refresh Token con una validez de 30 días.
 * @param {Object} user - El objeto de usuario (se espera que contenga _id y role).
 * @returns {String} Refresh Token
 */
const generateRefreshToken = (user) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET no está definido en las variables de entorno');
  }
  return jwt.sign({ userId: user._id }, refreshSecret, { expiresIn: '30d' });
};

/**
 * Verifica y decodifica el Access Token.
 * @param {String} token - El Access Token a verificar.
 * @returns {Object} Los datos decodificados del token.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verifica y decodifica el Refresh Token.
 * @param {String} token - El Refresh Token a verificar.
 * @returns {Object} Los datos decodificados del token.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const refreshAccessToken = (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  // Aquí podrías volver a consultar el rol si es necesario
  return generateAccessToken(decoded.userId);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken
};
