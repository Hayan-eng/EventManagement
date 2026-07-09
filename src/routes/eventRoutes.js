const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  checkAvailability
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/auth');
const { validateEvent } = require('../middlewares/validation');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/:id/availability', checkAvailability);

router.post('/', protect, authorize('organizer', 'admin'), validateEvent, createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), validateEvent, updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;