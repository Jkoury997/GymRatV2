const OTP = require('../database/models/OTP');
const User = require('../database/models/User');
const nodemailer = require('nodemailer');

/**
 * Envía el OTP por correo electrónico usando nodemailer.
 * @param {string} email - Correo del destinatario.
 * @param {string} otpCode - Código OTP a enviar.
 */
const sendOTPByEmail = async (email, otpCode) => {
  // Construir URL para restablecer contraseña (puedes personalizarla)
  const loginURL = `http://localhost:3000/auth/recovery?email=${encodeURIComponent(email)}&otp=${otpCode}`;
   // Define supportURL, ya sea a partir de una variable de entorno o un valor por defecto
   const supportURL = process.env.SUPPORT_URL || "http://localhost:3000/support";
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: true, // Usa SSL
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const htmlTemplate = `
  <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de verificación - Gym Tracker</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4; 
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: #fff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: #fff; 
            text-align: center; 
            padding: 25px; 
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
        }
        .content { 
            padding: 35px; 
            text-align: center; 
        }
        .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #3b82f6; 
            letter-spacing: 8px; 
            margin: 25px 0; 
            padding: 15px;
            background-color: #f0f7ff;
            border-radius: 8px;
            display: inline-block;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 25px;
            line-height: 1.7;
        }
        .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: #fff; 
            text-decoration: none; 
            padding: 14px 28px; 
            border-radius: 6px; 
            font-weight: bold; 
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        .button:hover {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        }
        .footer { 
            background-color: #f9fafb; 
            text-align: center; 
            padding: 25px; 
            font-size: 14px; 
            color: #6b7280; 
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 15px 0;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">GYM TRACKER</div>
            <div class="tagline">Tu compañero de entrenamiento personal</div>
        </div>
        <div class="content">
            <div class="icon">💪</div>
            <p class="message">Has solicitado un código de verificación para acceder a tu cuenta de Gym Tracker. Utiliza el siguiente código:</p>
            <div class="otp-code">${otpCode}</div>
            <p class="message">Este código expirará en 10 minutos. Si no has solicitado este código, puedes ignorar este correo.</p>
            <p style="margin-top: 30px; font-size: 15px; color: #6b7280;">¿Tienes problemas? <a href="${supportURL}" style="color: #3b82f6; text-decoration: none;">Contacta con soporte</a></p>
        </div>
        <div class="footer">
            <p>¡Gracias por usar Gym Tracker para alcanzar tus objetivos fitness!</p>
            <div class="divider"></div>
            <p>Este es un correo electrónico automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2024 Gym Tracker. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
  `;

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: email,
    subject: 'Recuperación de contraseña - OTP',
    html: htmlTemplate
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Genera un OTP, lo guarda en la BD y lo envía por correo.
 * @param {string} email - Correo del usuario.
 * @returns {Object} Mensaje de resultado.
 */
const generateOTP = async (email) => {
  // Buscar al usuario por email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  // Eliminar OTPs existentes para evitar duplicados
  await OTP.deleteMany({ userId: user._id });

  // Generar OTP de 6 dígitos
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Establecer la fecha de expiración: 10 minutos a partir de ahora
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Crear el nuevo registro de OTP
  await OTP.create({
    otpCode,
    userId: user._id,
    expiresAt
  });

  // Enviar el OTP por correo electrónico
  await sendOTPByEmail(user.email, otpCode);

  return { message: 'OTP enviado al correo electrónico.' };
};

/**
 * Verifica el OTP, marcándolo como usado para que no se pueda reutilizar.
 * @param {string} email - Correo del usuario.
 * @param {string} otpCode - Código OTP proporcionado.
 * @returns {Object} Resultado de la verificación.
 */
const verifyOTP = async (email, otpCode) => {
  if (!email || !otpCode) {
    throw new Error('Faltan datos requeridos: email u otpCode.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  // Buscar el OTP activo para el usuario
  const otp = await OTP.findOne({ otpCode, userId: user._id, isUsed: false });
  if (!otp) {
    throw new Error('OTP inválido o ya utilizado.');
  }

  // Verificar expiración
  if (otp.expiresAt < new Date()) {
    throw new Error('OTP expirado.');
  }

  // Marcar el OTP como usado
  otp.isUsed = true;
  await otp.save();

  return { message: 'OTP verificado correctamente.', isValidOTP: true };
};

/**
 * Verifica el OTP sin marcarlo como usado.
 * Útil para validación sin efectos secundarios.
 * @param {string} email - Correo del usuario.
 * @param {string} otpCode - Código OTP proporcionado.
 * @returns {Object} Resultado de la verificación.
 */
const verifyOTPOnly = async (email, otpCode) => {
  if (!email || !otpCode) {
    throw new Error('Faltan datos requeridos: email u otpCode.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  // Buscar el OTP sin marcarlo como usado
  const otp = await OTP.findOne({ otpCode, userId: user._id, isUsed: false });
  if (!otp) {
    throw new Error('OTP inválido o ya utilizado.');
  }

  if (otp.expiresAt < new Date()) {
    throw new Error('OTP expirado.');
  }

  return { message: 'OTP verificado correctamente.', isValidOTP: true };
};

/**
 * Verifica el OTP y, si es válido, cambia la contraseña del usuario.
 * Se asume que el modelo User tiene un pre-hook para hashear la contraseña.
 * @param {string} email - Correo del usuario.
 * @param {string} otpCode - Código OTP proporcionado.
 * @param {string} newPassword - Nueva contraseña.
 * @returns {Object} Resultado con mensaje.
 */
const changePasswordWithOTP = async (email, otpCode, newPassword) => {
  // Verificar el OTP (esto marcará el OTP como usado)
  await verifyOTP(email, otpCode);

  // Buscar al usuario y cambiar la contraseña
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  user.password = newPassword; // El pre-hook en el modelo User se encargará de hashearla
  await user.save();

  return { message: 'Contraseña cambiada correctamente.' };
};

module.exports = {
  generateOTP,
  verifyOTP,
  verifyOTPOnly,
  changePasswordWithOTP
};
