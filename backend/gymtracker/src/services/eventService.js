const Event = require('../database/models/Event.js');

const createEvent = async (data) => {
  return await Event.create(data);
};

const getEvents = async (filter = {}) => {
  return await Event.find(filter);
};

const updateEvent = async (id, data) => {
  return await Event.findByIdAndUpdate(id, data, { new: true });
};

const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};
