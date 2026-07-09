const eventService = require('../services/eventService');

const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents(req.query);
    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await eventService.deleteEvent(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Event cancelled successfully',
      event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const availability = await eventService.checkAvailability(req.params.id);
    res.json({
      success: true,
      ...availability
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  checkAvailability
};