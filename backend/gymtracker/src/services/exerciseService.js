const ExerciseUser = require('../database/models/ExerciseUser.js');
const WorkoutRecord = require('../database/models/WorkoutRecord');

const createExercise = async (data) => {
  return await ExerciseUser.create(data);
};

const getExercises = async (filter = {}) => {
  return await ExerciseUser.find(filter);
};

const getExercisesUserId = async (userId) => {
  return await ExerciseUser.find({ userId });
};

const getExerciseById = async (id) => {
  return await ExerciseUser.findById(id);
};

const updateExercise = async (id, data) => {
  return await ExerciseUser.findByIdAndUpdate(id, data, { new: true });
};

const deleteExercise = async (id) => {
  // Elimina todos los registros asociados a este ejercicio
  await WorkoutRecord.deleteMany({ exerciseUserId: id });

  // Luego elimina el ejercicio personalizado
  return await ExerciseUser.findByIdAndDelete(id);
};

module.exports = {
  createExercise,
  getExercises,
  getExercisesUserId,
  getExerciseById,
  updateExercise,
  deleteExercise
};
