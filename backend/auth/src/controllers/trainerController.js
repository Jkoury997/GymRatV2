const trainerLinkService = require('../services/trainerLinkService');

/**
 * Permite que un alumno se vincule a un entrenador utilizando el código de vinculación.
 * Se espera que el alumno envíe en el body: { linkCode }
 * La información del alumno se obtiene del token en req.user.
 */
const linkTrainer = async (req, res, next) => {
  try {
    const studentId = req.user.userId; // Alumno autenticado
    const { linkCode } = req.body;
    console.log(studentId)
    
    if (!linkCode) {
      return res.status(400).json({ message: 'El código de vinculación es obligatorio' });
    }
    const link = await trainerLinkService.linkTrainer(studentId, linkCode);
    res.status(200).json({
      message: 'Entrenador vinculado exitosamente',
      link
    });
  } catch (error) {
    next(error);
  }
};

const unlinkTrainer = async (req, res, next) => {
  try {
    const studentId = req.user.userId;

    const result = await trainerLinkService.unlinkTrainer(studentId);

    res.status(200).json({
      message: 'Entrenador desvinculado exitosamente',
      result
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Permite a un entrenador obtener la lista de sus alumnos vinculados.
 */
const getStudents = async (req, res, next) => {
  try {
    const trainerId = req.user.userId;
    const students = await trainerLinkService.getStudentsForTrainer(trainerId);
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  linkTrainer,
  getStudents,
  unlinkTrainer
};
