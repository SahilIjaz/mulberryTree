const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } = require('../utils/tokenUtils');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, bio, location, specialties, farmName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(ApiError.badRequest('Email already registered'));
    }

    const user = await User.create({
      name, email, password, role, bio, location, specialties, farmName,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return next(ApiError.unauthorized('No refresh token'));
    }

    const userId = await verifyRefreshToken(token);
    const user = await User.findById(userId);
    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }

    await revokeRefreshToken(token);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(ApiError.unauthorized('Invalid refresh token'));
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) {
      await revokeRefreshToken(token);
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        specialties: user.specialties,
        farmName: user.farmName,
      },
    });
  } catch (error) {
    next(error);
  }
};
