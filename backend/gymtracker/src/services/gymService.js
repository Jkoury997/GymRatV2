const Gym = require('../database/models/Gym.js');
const Machine = require('../database/models/Machine.js');

const createGym = async (data) => {
  return await Gym.create(data);
};

const getGyms = async (filter = {}) => {
  return await Gym.find(filter).populate('machines');
};

const updateGym = async (id, data) => {
  return await Gym.findByIdAndUpdate(id, data, { new: true });
};

const deleteGym = async (id) => {
  return await Gym.findByIdAndDelete(id);
};

// Machines dentro del gym
const addMachineToGym = async (gymId, machineData) => {
  const machine = await Machine.create({ ...machineData, gymId });
  await Gym.findByIdAndUpdate(gymId, { $push: { machines: machine._id } });
  return machine;
};

const updateMachine = async (id, data) => {
  return await Machine.findByIdAndUpdate(id, data, { new: true });
};

const deleteMachine = async (id) => {
  const machine = await Machine.findByIdAndDelete(id);
  if (machine) {
    await Gym.findByIdAndUpdate(machine.gymId, { $pull: { machines: machine._id } });
  }
  return machine;
};

module.exports = {
  createGym,
  getGyms,
  updateGym,
  deleteGym,
  addMachineToGym,
  updateMachine,
  deleteMachine
};
