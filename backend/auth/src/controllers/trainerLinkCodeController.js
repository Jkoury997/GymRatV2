// src/auth/controllers/trainerLinkCode.controller.js
const trainerLinkCodeService = require('../services/trainerLinkCodeService');

/**
 * Controlador para crear o actualizar el código de vinculación de un entrenador.
 * Se espera que el entrenador esté autenticado (req.user.userId).
 */
const createTrainerLinkCode = async (req, res, next) => {
  try {
    const trainerId = req.user.userId;
    const linkRecord = await trainerLinkCodeService.createOrUpdateTrainerLinkCode(trainerId);
    res.status(200).json({
      message: 'Código de vinculación generado exitosamente',
      linkCode: linkRecord.linkCode
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene el código de vinculación del entrenador.
 */
const getTrainerLinkCode = async (req, res, next) => {
    try {
      const trainerId = req.user.userId;
      const linkRecord = await trainerLinkCodeService.getTrainerLinkCode(trainerId);
      if (!linkRecord) {
        return res.status(404).json({ message: 'No se encontró código de vinculación para este entrenador' });
      }
      res.status(200).json({ linkCode: linkRecord.linkCode });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  createTrainerLinkCode,
  getTrainerLinkCode
};
