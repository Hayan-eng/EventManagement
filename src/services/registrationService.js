const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

const registerForEvent = async (userId, eventId) => {
  // التحقق من وجود الفعالية
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // التحقق من أن الفعالية لم تُلغَ
  if (event.status === 'cancelled') {
    throw new Error('Event is cancelled');
  }

  // التحقق من وجود مقاعد
  if (event.availableSeats <= 0) {
    throw new Error('No seats available');
  }

  // التحقق من عدم تسجيل المستخدم مسبقاً
  const existingRegistration = await Registration.findOne({
    user: userId,
    event: eventId
  });

  if (existingRegistration) {
    throw new Error('Already registered for this event');
  }

  // إنشاء تسجيل جديد
  const registration = await Registration.create({
    user: userId,
    event: eventId,
    status: 'confirmed'
  });

  // تقليل عدد المقاعد المتاحة
  event.availableSeats -= 1;
  await event.save();

  // إضافة الفعالية إلى قائمة الفعاليات المسجل فيها المستخدم
  await User.findByIdAndUpdate(userId, {
    $push: { registeredEvents: eventId }
  });

  return registration;
};

const getUserRegistrations = async (userId) => {
  return await Registration.find({ user: userId })
    .populate('event')
    .sort({ registrationDate: -1 });
};

const getEventRegistrations = async (eventId) => {
  return await Registration.find({ event: eventId })
    .populate('user', 'name email');
};

const cancelRegistration = async (userId, registrationId) => {
  const registration = await Registration.findById(registrationId);
  
  if (!registration) {
    throw new Error('Registration not found');
  }

  if (registration.user.toString() !== userId.toString()) {
    throw new Error('Not authorized to cancel this registration');
  }

  if (registration.status === 'cancelled') {
    throw new Error('Registration already cancelled');
  }

  registration.status = 'cancelled';
  await registration.save();

  const event = await Event.findById(registration.event);
  if (event) {
    event.availableSeats += 1;
    await event.save();
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { registeredEvents: registration.event }
  });

  return registration;
};

const updateAttendance = async (registrationId, attended) => {
  const registration = await Registration.findById(registrationId);
  
  if (!registration) {
    throw new Error('Registration not found');
  }

  registration.attended = attended;
  await registration.save();
  return registration;
};

module.exports = {
  registerForEvent,
  getUserRegistrations,
  getEventRegistrations,
  cancelRegistration,
  updateAttendance
};