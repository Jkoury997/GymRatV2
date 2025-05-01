const express = require('express');
const router = express.Router();
const WorkoutController = require('../controllers/workoutRecordController');


// Rutas protegidas
router.post('/', WorkoutController.createRecord);
router.get('/user', WorkoutController.getRecordsByUserId);

// Acceso libre (o también podés protegerlas)
router.get('/', WorkoutController.getRecords);
router.get('/:id', WorkoutController.getRecordsId);

router.put('/:id', WorkoutController.updateRecord);
router.delete('/:id', WorkoutController.deleteRecord);

module.exports = router;
