const authService = require('../services/authService');

// Registro de usuario
const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await authService.registerUser(userData);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    next(error);
  }
};

// Login de usuario
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios: email y contraseña' });
    }
    const { accessToken, refreshToken, user } = await authService.loginUser(email, password);
    // Excluir la contraseña de la respuesta
    const { password: pwd, ...userWithoutPassword } = user._doc;
    res.status(200).json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

// Refrescar Access Token
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'El refresh token es obligatorio' });
    }
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// Logout del usuario
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'El refresh token es obligatorio para cerrar sesión' });
    }
    await authService.logoutUser(refreshToken);
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    next(error);
  }
};

// Revocar todos los refresh tokens para el usuario (logout global)
const revokeAllTokens = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await authService.revokeAllRefreshTokens(userId);
    res.status(200).json({ message: 'Todos los tokens han sido revocados' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  revokeAllTokens
};
