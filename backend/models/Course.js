const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessons: [{
    title: { type: String, required: true },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
  }],
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'General',
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  maxEnrollment: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

courseSchema.virtual('enrollmentCount').get(function () {
  return this.enrolledUsers ? this.enrolledUsers.length : 0;
});

module.exports = mongoose.model('Course', courseSchema);
