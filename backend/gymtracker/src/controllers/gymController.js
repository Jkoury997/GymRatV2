const GymService = require("../services/gymService");

const createGym = async (req, res, next) => {
  try {
    const gym = await GymService.createGym(req.body);
    res.status(201).json(gym);
  } catch (err) {
    next(err);
  }
};

const getGyms = async (req, res, next) => {
  try {
    const gyms = await GymService.getGyms();
    res.json(gyms);
  } catch (err) {
    next(err);
  }
};

const updateGym = async (req, res, next) => {
  try {
    const gym = await GymService.updateGym(req.params.id, req.body);
    res.json(gym);
  } catch (err) {
    next(err);
  }
};

const deleteGym = async (req, res, next) => {
  try {
    await GymService.deleteGym(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Machines
const addMachine = async (req, res, next) => {
  try {
    const machine = await GymService.addMachineToGym(req.params.gymId, req.body);
    res.status(201).json(machine);
  } catch (err) {
    next(err);
  }
};

const updateMachine = async (req, res, next) => {
  try {
    const machine = await GymService.updateMachine(req.params.id, req.body);
    res.json(machine);
  } catch (err) {
    next(err);
  }
};

const deleteMachine = async (req, res, next) => {
  try {
    await GymService.deleteMachine(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createGym,
  getGyms,
  updateGym,
  deleteGym,
  addMachine,
  updateMachine,
  deleteMachine
};
