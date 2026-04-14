const express = require('express');
const router = express.Router();
const { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, rateRecipe } = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadSingle, uploadToCloudinary } = require('../middleware/upload');
const { recipeRules, validate } = require('../middleware/validate');

router.post('/', protect, authorize('chef', 'admin'), uploadSingle, 
uploadToCloudinary('mulberrytree/recipes'), recipeRules, validate, createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, authorize('chef', 'admin'), uploadSingle, uploadToCloudinary('mulberrytree/recipes'), updateRecipe);
router.delete('/:id', protect, authorize('chef', 'admin'), deleteRecipe);
router.post('/:id/rate', protect, rateRecipe);

module.exports = router;
