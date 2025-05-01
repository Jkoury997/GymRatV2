const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');

// CRUD Events
router.post('/', EventController.createEvent);
router.get('/', EventController.getEvents);
router.put('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

module.exports = router;
