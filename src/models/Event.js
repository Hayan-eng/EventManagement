const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 1000
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1,
    default: 50
  },
  availableSeats: {
    type: Number,
    min: 0
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  }]
}, {
  timestamps: true
});

// ✅ بدون استخدام next (async/await فقط)
eventSchema.pre('save', async function() {
  if (this.isNew) {
    this.availableSeats = this.capacity;
  }
});

module.exports = mongoose.model('Event', eventSchema);