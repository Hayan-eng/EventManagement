const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
  updateAttendance
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middlewares/auth');
const { validateRegistration } = require('../middlewares/validation');

router.use(protect);

router.get('/my', getUserRegistrations);
router.post('/', validateRegistration, registerForEvent);
router.put('/:id/cancel', cancelRegistration);
router.put('/:id/attendance', authorize('organizer', 'admin'), updateAttendance);

module.exports = router;