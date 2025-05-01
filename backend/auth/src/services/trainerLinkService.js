
const TrainerStudentLink = require('../database/models/TrainerStudentLink');
const TrainerLinkCode = require('../database/models/TrainerLinkCode');

/**
 * Vincula a un alumno a un entrenador utilizando el código de vinculación.
 * Busca al entrenador que tenga el linkCode especificado y, si el alumno aún no está vinculado,
 * crea un registro en TrainerStudentLink.
 *
 * @param {String} studentId - UUID del alumno.
 * @param {String} linkCode - Código de vinculación proporcionado por el alumno.
 * @returns {Promise<Object>} El registro de vinculación creado.
 * @throws {Error} Si no se encuentra un entrenador con ese código o el alumno ya está vinculado.
 */
const linkTrainer = async (studentId, linkCode) => {
  // Buscar el registro de vinculación en TrainerLinkCode por el código
  const trainerLinkRecord = await TrainerLinkCode.findOne({ linkCode });
  if (!trainerLinkRecord) {
    throw new Error('Entrenador no encontrado con ese código de vinculación');
  }

  // Verificar si el alumno ya está vinculado a un entrenador
  const existingLink = await TrainerStudentLink.findOne({ studentId });
  if (existingLink) {
    throw new Error('El alumno ya está vinculado a un entrenador');
  }

  // Crear el registro de vinculación usando el trainerId obtenido del registro de vinculación
  const link = await TrainerStudentLink.create({
    trainerId: trainerLinkRecord.trainerId,
    studentId
  });
  return link;
};

const unlinkTrainer = async (studentId) => {
  const result = await TrainerStudentLink.findOneAndDelete({ studentId });

  if (!result) {
    throw new Error('El alumno no estaba vinculado a ningún entrenador');
  }

  return result; // o simplemente true si querés una confirmación
};


/**
 * Obtiene la lista de alumnos vinculados a un entrenador.
 *
 * @param {String} trainerId - UUID del entrenador.
 * @returns {Promise<Array>} Lista de documentos de vinculación con información del alumno.
 */
const getStudentsForTrainer = async (trainerId) => {
  return await TrainerStudentLink.find({ trainerId }).populate('studentId');
};

module.exports = {
  linkTrainer,
  getStudentsForTrainer,
  unlinkTrainer
};
