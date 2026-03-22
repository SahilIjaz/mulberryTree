const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, attendEvent, unattendEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadSingle, uploadToCloudinary } = require('../middleware/upload');
const { eventRules, validate } = require('../middleware/validate');

router.post('/', protect, authorize('chef', 'farmer', 'admin'), uploadSingle, uploadToCloudinary('mulberrytree/events'), eventRules, validate, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, authorize('chef', 'farmer', 'admin'), uploadSingle, uploadToCloudinary('mulberrytree/events'), updateEvent);
router.delete('/:id', protect, authorize('chef', 'farmer', 'admin'), deleteEvent);
router.post('/:id/attend', protect, attendEvent);
router.delete('/:id/attend', protect, unattendEvent);

module.exports = router;
