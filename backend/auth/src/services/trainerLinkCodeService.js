// src/auth/services/trainerLinkCode.service.js
const TrainerLinkCode = require('../database/models/TrainerLinkCode');

/**
 * Genera un código de vinculación aleatorio de 6 caracteres (en mayúsculas).
 */
const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Crea el código de vinculación para un entrenador si aún no existe.
 * @param {String} trainerId - El UUID del entrenador.
 * @returns {Promise<Object>} El registro existente o creado.
 */
const createOrUpdateTrainerLinkCode = async (trainerId) => {
  // Verificar si ya existe un código
  let linkRecord = await TrainerLinkCode.findOne({ trainerId });

  if (linkRecord) {
    // Ya existe, no se actualiza
    return linkRecord;
  }

  // Si no existe, se genera y guarda uno nuevo
  const newCode = generateRandomCode();
  linkRecord = await TrainerLinkCode.create({ trainerId, linkCode: newCode });

  return linkRecord;
};


const getTrainerLinkCode = async (trainerId) => {
    return await TrainerLinkCode.findOne({ trainerId });
  };

module.exports = {
  createOrUpdateTrainerLinkCode,
  getTrainerLinkCode
};
