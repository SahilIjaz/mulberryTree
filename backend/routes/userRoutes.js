const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadSingle, uploadToCloudinary } = require('../middleware/upload');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', getProfile);
router.put('/profile', protect, uploadSingle, uploadToCloudinary('mulberrytree/avatars'), updateProfile);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
