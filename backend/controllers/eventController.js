const Event = require('../models/Event');
const ApiError = require('../utils/apiError');

exports.createEvent = async (req, res, next) => {
  try {
    const data = { ...req.body, organizer: req.user._id };
    if (req.file) data.image = req.file.cloudinaryUrl;

    const event = await Event.create(data);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.eventType) filter.eventType = req.query.eventType;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.upcoming === 'true') filter.date = { $gte: new Date() };
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const [events, total] = await Promise.all([
      Event.find(filter).populate('organizer', 'name avatar').skip(skip).limit(limit).sort('date'),
      Event.countDocuments(filter),
    ]);

    res.json({
      success: true,
      events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name avatar bio');
    if (!event) return next(ApiError.notFound('Event not found'));
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return next(ApiError.notFound('Event not found'));

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(ApiError.forbidden('Not authorized'));
    }

    const data = { ...req.body };
    if (req.file) data.image = req.file.cloudinaryUrl;

    event = await Event.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(ApiError.notFound('Event not found'));

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(ApiError.forbidden('Not authorized'));
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

exports.attendEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(ApiError.notFound('Event not found'));

    if (event.attendees.includes(req.user._id)) {
      return next(ApiError.badRequest('Already attending'));
    }

    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return next(ApiError.badRequest('Event is full'));
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.json({ success: true, message: 'Registered for event' });
  } catch (error) {
    next(error);
  }
};

exports.unattendEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(ApiError.notFound('Event not found'));

    event.attendees = event.attendees.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await event.save();

    res.json({ success: true, message: 'Unregistered from event' });
  } catch (error) {
    next(error);
  }
};
