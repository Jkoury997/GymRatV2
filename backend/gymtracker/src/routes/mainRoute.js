const express = require('express');
const router = express.Router();

const gymRoutes = require('./gymRoute');
const exerciseRoutes = require('./exerciseRoute');
const workoutRecordRoute = require('./workoutRecordRoute');
const eventRoutes = require('./eventRoute');

const categoryRoute = require('./categoryRoute');

//middleware
const authMiddleware = require('../middlewares/authMiddleware');


router.use('/gym',authMiddleware, gymRoutes);
router.use('/exercises',authMiddleware, exerciseRoutes);
router.use('/workouts',authMiddleware, workoutRecordRoute);
router.use('/events',authMiddleware, eventRoutes);
router.use('/categories', categoryRoute);

module.exports = router;
