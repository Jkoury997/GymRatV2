const User = require('../database/models/User');
const RefreshToken = require('../database/models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwtService = require('./jwtService');
// Si usas un servicio para roles, también se puede incluir, por ejemplo:
 const roleService = require('./roleService');
const trainerLinkCodeService = require('./trainerLinkCodeService');

/**
 * Registra un nuevo usuario verificando que el email no exista.
 */
const registerUser = async (userData) => {
  const { email } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }
  // Crear el usuario
  const newUser = await User.create(userData);

  // Asignar el rol por defecto "user" usando el roleService.
  // Aquí se puede optar por llamar a assignOrUpdateRoleForUser.
  const role = userData.role === 'trainer' ? 
  userData.role : 'user'; // Si no es "trainer", se asigna por defecto "user"

await roleService.assignOrUpdateRoleForUser(newUser._id, role);
await trainerLinkCodeService.createOrUpdateTrainerLinkCode(newUser._id)


  return newUser;
};

/**
 * Realiza el login del usuario:
 * - Verifica el email y la contraseña  
 * - Genera un Refresh Token y lo almacena en la BD  
 * - Genera un Access Token  
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }
  // Generar Refresh Token (se puede generar de forma síncrona)
  const refreshToken = jwtService.generateRefreshToken(user);
  // Establecer la expiración (por ejemplo, 30 días)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  // Guardar el Refresh Token en la BD
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt
  });
  // Generar Access Token: usar await si la función es asíncrona
  const accessToken = await jwtService.generateAccessToken(user._id, user.role);
  return { accessToken, refreshToken, user };
};

/**
 * Refresca el Access Token usando el Refresh Token proporcionado.
 */
const refreshAccessToken = async (refreshToken) => {
  // Buscar el Refresh Token en la BD
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenDoc) {
    throw new Error('El refresh token es inválido o ha sido revocado');
  }
  // Verificar expiración
  if (tokenDoc.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token: refreshToken });
    throw new Error('El refresh token ha expirado');
  }
  // Verificar y decodificar el refresh token
  const decoded = jwtService.verifyRefreshToken(refreshToken);
  const accessToken = jwtService.generateAccessToken(decoded.userId, decoded.role);
  return accessToken;
};

/**
 * Elimina (revoca) un Refresh Token para el logout.
 */
const logoutUser = async (refreshToken) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};

/**
 * Revoca todos los Refresh Tokens asociados a un usuario.
 */
const revokeAllRefreshTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  revokeAllRefreshTokens
};
