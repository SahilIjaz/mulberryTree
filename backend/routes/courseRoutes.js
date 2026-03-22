const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, enrollInCourse, unenrollFromCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadSingle, uploadToCloudinary } = require('../middleware/upload');
const { courseRules, validate } = require('../middleware/validate');

router.post('/', protect, authorize('chef', 'admin'), uploadSingle, uploadToCloudinary('mulberrytree/courses'), courseRules, validate, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', protect, authorize('chef', 'admin'), uploadSingle, uploadToCloudinary('mulberrytree/courses'), updateCourse);
router.delete('/:id', protect, authorize('chef', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollInCourse);
router.delete('/:id/enroll', protect, unenrollFromCourse);

module.exports = router;
