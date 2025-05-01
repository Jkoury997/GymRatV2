const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/exerciseController');

// Protegidas con token
router.post('/', ExerciseController.createExercise);
router.get('/', ExerciseController.getExercises);
router.get('/user', ExerciseController.getExercisesByUserId);
router.get('/:id', ExerciseController.getExerciseById);
router.put('/:id', ExerciseController.updateExercise);
router.delete('/:id', ExerciseController.deleteExercise);

module.exports = router;
