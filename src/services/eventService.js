const Event = require('../models/Event');
const Registration = require('../models/Registration');

const createEvent = async (eventData, organizerId) => {
  const event = await Event.create({
    ...eventData,
    organizer: organizerId,
    availableSeats: eventData.capacity
  });
  return event;
};

const getAllEvents = async (filters = {}) => {
  const query = { status: { $ne: 'cancelled' } };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.date) {
    query.date = { $gte: new Date(filters.date) };
  }

  return await Event.find(query)
    .populate('organizer', 'name email')
    .sort({ date: 1 });
};

const getEventById = async (eventId) => {
  const event = await Event.findById(eventId)
    .populate('organizer', 'name email')
    .populate('registrations', 'user status');
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  return event;
};

const updateEvent = async (eventId, updateData, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  if (event.organizer.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this event');
  }
  
  Object.assign(event, updateData);
  await event.save();
  return event;
};

const deleteEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  if (event.organizer.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this event');
  }
  
  event.status = 'cancelled';
  await event.save();
  return event;
};

const checkAvailability = async (eventId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  return {
    availableSeats: event.availableSeats,
    totalCapacity: event.capacity,
    isAvailable: event.availableSeats > 0
  };
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  checkAvailability
};