const Recipe = require('../models/Recipe');
const ApiError = require('../utils/apiError');

exports.createRecipe = async (req, res, next) => {
  try {
    const data = { ...req.body, author: req.user._id };
    if (typeof data.ingredients === 'string') data.ingredients = JSON.parse(data.ingredients);
    if (typeof data.instructions === 'string') data.instructions = JSON.parse(data.instructions);
    if (typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    if (req.file) data.image = req.file.cloudinaryUrl;

    const recipe = await Recipe.create(data);
    res.status(201).json({ success: true, recipe });
  } catch (error) {
    next(error);
  }
};

exports.getAllRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.cuisine) filter.cuisine = req.query.cuisine;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } },
      ];
    }

    const sort = req.query.sort === 'rating' ? '-averageRating' : '-createdAt';

    const [recipes, total] = await Promise.all([
      Recipe.find(filter).populate('author', 'name avatar').skip(skip).limit(limit).sort(sort),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      success: true,
      recipes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name avatar bio');
    if (!recipe) return next(ApiError.notFound('Recipe not found'));
    res.json({ success: true, recipe });
  } catch (error) {
    next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) return next(ApiError.notFound('Recipe not found'));

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(ApiError.forbidden('Not authorized to update this recipe'));
    }

    const data = { ...req.body };
    if (typeof data.ingredients === 'string') data.ingredients = JSON.parse(data.ingredients);
    if (typeof data.instructions === 'string') data.instructions = JSON.parse(data.instructions);
    if (typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    if (req.file) data.image = req.file.cloudinaryUrl;

    recipe = await Recipe.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, recipe });
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return next(ApiError.notFound('Recipe not found'));

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(ApiError.forbidden('Not authorized to delete this recipe'));
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    next(error);
  }
};

exports.rateRecipe = async (req, res, next) => {
  try {
    const { score } = req.body;
    if (!score || score < 1 || score > 5) {
      return next(ApiError.badRequest('Rating must be between 1 and 5'));
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return next(ApiError.notFound('Recipe not found'));

    const existingRating = recipe.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.score = score;
    } else {
      recipe.ratings.push({ user: req.user._id, score });
    }

    await recipe.save();
    res.json({ success: true, averageRating: recipe.averageRating });
  } catch (error) {
    next(error);
  }
};
