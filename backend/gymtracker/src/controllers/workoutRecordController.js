const WorkoutService = require('../services/workoutRecordService');

exports.createRecord = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.userId
    };

    const record = await WorkoutService.createWorkoutRecord(payload);
    res.status(201).json(record);
  } catch (err) {
    console.error("Error creando workout:", err);
    next(err);
  }
};

exports.getRecords = async (req, res, next) => {
  try {
    const records = await WorkoutService.getWorkoutRecords();
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.getRecordsId = async (req, res, next) => {
  try {
    const records = await WorkoutService.getWorkoutRecordsId(req.params.id);
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.getRecordsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const records = await WorkoutService.getWorkoutRecordsByUserId(userId);
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.updateRecord = async (req, res, next) => {
  try {
    const record = await WorkoutService.updateWorkoutRecord(req.params.id, req.body);
    res.json(record);
  } catch (err) {
    next(err);
  }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    await WorkoutService.deleteWorkoutRecord(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
