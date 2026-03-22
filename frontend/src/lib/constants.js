export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const ROLES = {
  USER: 'user',
  CHEF: 'chef',
  FARMER: 'farmer',
  ADMIN: 'admin',
};

export const CUISINES = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian',
  'French', 'Thai', 'Mediterranean', 'American', 'Korean',
  'Middle Eastern', 'African', 'Caribbean', 'Other',
];

export const DIFFICULTIES = ['easy', 'medium', 'hard'];

export const EVENT_TYPES = ['workshop', 'market', 'harvest', 'tasting', 'other'];

export const COURSE_CATEGORIES = [
  'Baking', 'Grilling', 'Pastry', 'Fermentation', 'Farm-to-Table',
  'Plant-Based', 'Meat & Poultry', 'Seafood', 'Desserts', 'General',
];

export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'];
