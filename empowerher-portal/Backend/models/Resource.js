const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'career-development',
      'education-scholarships',
      'health-wellness',
      'legal-rights',
      'entrepreneurship',
      'leadership',
      'technology',
      'finance',
      'mental-health',
      'safety'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'course', 'ebook', 'toolkit', 'webinar', 'podcast']
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isFree: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'English'
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', ResourceSchema);