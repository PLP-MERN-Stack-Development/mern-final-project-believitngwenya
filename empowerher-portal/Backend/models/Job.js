const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'technology',
      'business',
      'healthcare',
      'education',
      'engineering',
      'design',
      'marketing',
      'finance'
    ]
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  applicationUrl: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: Date,
  tags: [String]
}, {
  timestamps: true
});

JobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Job', JobSchema);
