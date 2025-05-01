const ExerciseService = require('../services/exerciseService.js');

const createExercise = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.user.userId
    };
    const exercise = await ExerciseService.createExercise(data);
    res.status(201).json(exercise);
  } catch (err) {
    next(err);
  }
};

const getExercises = async (req, res, next) => {
  try {
    const exercises = await ExerciseService.getExercises();
    res.json(exercises);
  } catch (err) {
    next(err);
  }
};

const getExercisesByUserId = async (req, res, next) => {
  try {
    const exercises = await ExerciseService.getExercisesUserId(req.user.userId);
    res.json(exercises);
  } catch (err) {
    next(err);
  }
};

const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await ExerciseService.getExerciseById(req.params.id);
    if (!exercise) return res.status(404).json({ message: 'Ejercicio no encontrado' });
    res.json(exercise);
  } catch (err) {
    next(err);
  }
};

const updateExercise = async (req, res, next) => {
  try {
    const exercise = await ExerciseService.updateExercise(req.params.id, req.body);
    res.json(exercise);
  } catch (err) {
    next(err);
  }
};

const deleteExercise = async (req, res, next) => {
  try {
    await ExerciseService.deleteExercise(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createExercise,
  getExercises,
  getExercisesByUserId,
  getExerciseById,
  updateExercise,
  deleteExercise
};
