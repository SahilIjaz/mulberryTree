const User = require('../models/User');
const ApiError = require('../utils/apiError');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(ApiError.notFound('User not found'));

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, specialties, farmName } = req.body;
    const updates = { name, bio, location, specialties, farmName };

    if (req.file) {
      updates.avatar = req.file.cloudinaryUrl;
    }

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const roleFilter = req.query.role ? { role: req.query.role } : {};

    const [users, total] = await Promise.all([
      User.find(roleFilter).skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(roleFilter),
    ]);

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'chef', 'farmer', 'admin'].includes(role)) {
      return next(ApiError.badRequest('Invalid role'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return next(ApiError.notFound('User not found'));
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(ApiError.notFound('User not found'));
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
