const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000,
  },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String, default: '' },
  }],
  instructions: [{
    type: String,
    required: true,
  }],
  cookTime: {
    type: Number,
    required: true,
  },
  prepTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  cuisine: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  image: {
    type: String,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 },
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

recipeSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
  next();
});

recipeSchema.index({ author: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ cuisine: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
