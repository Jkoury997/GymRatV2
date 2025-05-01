const recoveryService = require('../services/recoveryService');

/**
 * Genera el OTP y lo envía al correo del usuario.
 */
const generateOTP = async (req, res, next) => {

  try {
    const { email } = req.body;
    const result = await recoveryService.generateOTP(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica el OTP y lo marca como usado.
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;
    const result = await recoveryService.verifyOTP(email, otpCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica el OTP sin marcarlo como usado (solo validación).
 */
const verifyOTPOnly = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;
    const result = await recoveryService.verifyOTPOnly(email, otpCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica el OTP y, si es válido, cambia la contraseña del usuario.
 */
const changePasswordWithOTP = async (req, res, next) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const result = await recoveryService.changePasswordWithOTP(email, otpCode, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateOTP,
  verifyOTP,
  verifyOTPOnly,
  changePasswordWithOTP
};
