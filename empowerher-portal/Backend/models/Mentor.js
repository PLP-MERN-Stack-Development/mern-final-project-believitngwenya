const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  expertise: [{
    category: String,
    skills: [String]
  }],
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'limited'],
    default: 'limited'
  },
  experience: {
    years: Number,
    description: String,
    achievements: [String]
  },
  menteeCapacity: {
    type: Number,
    default: 5
  },
  currentMentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  isAcceptingMentees: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', MentorSchema);