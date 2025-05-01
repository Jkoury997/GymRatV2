const WorkoutRecord = require('../database/models/WorkoutRecord.js');

const createWorkoutRecord = async (data) => {
  return await WorkoutRecord.create(data);
};

const getWorkoutRecords = async () => {
  return await WorkoutRecord.find().populate('exerciseUserId');
};

const getWorkoutRecordsId = async (exerciseUserId) => {
  return await WorkoutRecord
    .find({ exerciseUserId })            // <- acá filtrás
    .populate('exerciseUserId');
};


const getWorkoutRecordsByUserId = async (userId) => {
  return await WorkoutRecord.find({ userId }).populate({
    path: 'exerciseUserId',
    populate: {
      path: 'category',
      model: 'Category'
    }
  });
};

const updateWorkoutRecord = async (id, data) => {
  return await WorkoutRecord.findByIdAndUpdate(id, data, { new: true });
};

const deleteWorkoutRecord = async (id) => {
  return await WorkoutRecord.findByIdAndDelete(id);
};

module.exports = {
  createWorkoutRecord,
  getWorkoutRecords,
  getWorkoutRecordsByUserId,
  updateWorkoutRecord,
  deleteWorkoutRecord,
  getWorkoutRecordsId 
};
