const express = require('express');
const router = express.Router();
const GymController = require('../controllers/gymController');

// CRUD Gym
router.post('/', GymController.createGym);
router.get('/', GymController.getGyms);
router.put('/:id', GymController.updateGym);
router.delete('/:id', GymController.deleteGym);

// Machines
router.post('/:gymId/machines', GymController.addMachine);
router.put('/machines/:id', GymController.updateMachine);
router.delete('/machines/:id', GymController.deleteMachine);

module.exports = router;


