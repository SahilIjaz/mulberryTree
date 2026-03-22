const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

const generateRefreshToken = async (user) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token,
    user: user._id,
    expiresAt,
  });

  return token;
};

const verifyRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });
  if (!refreshToken) {
    throw new Error('Invalid refresh token');
  }
  if (refreshToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: refreshToken._id });
    throw new Error('Refresh token expired');
  }
  return refreshToken.user;
};

const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
};
