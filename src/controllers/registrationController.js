const registrationService = require('../services/registrationService');

const registerForEvent = async (req, res) => {
  try {
    const registration = await registrationService.registerForEvent(
      req.user.id,
      req.body.eventId
    );
    res.status(201).json({
      success: true,
      registration
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await registrationService.getUserRegistrations(req.user.id);
    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await registrationService.cancelRegistration(
      req.user.id,
      req.params.id
    );
    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      registration
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const registration = await registrationService.updateAttendance(
      req.params.id,
      req.body.attended
    );
    res.json({
      success: true,
      registration
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
  updateAttendance
};