const EventService = require('../services/eventService');

const createEvent = async (req, res, next) => {
  try {
    const event = await EventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await EventService.getEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await EventService.updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await EventService.deleteEvent(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};
