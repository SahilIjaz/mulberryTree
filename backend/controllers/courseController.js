const Course = require('../models/Course');
const ApiError = require('../utils/apiError');

exports.createCourse = async (req, res, next) => {
  try {
    const data = { ...req.body, instructor: req.user._id };
    if (typeof data.lessons === 'string') data.lessons = JSON.parse(data.lessons);
    if (req.file) data.image = req.file.cloudinaryUrl;

    const course = await Course.create(data);
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const [courses, total] = await Promise.all([
      Course.find(filter).populate('instructor', 'name avatar').skip(skip).limit(limit).sort('-createdAt'),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      courses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');
    if (!course) return next(ApiError.notFound('Course not found'));
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return next(ApiError.notFound('Course not found'));

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(ApiError.forbidden('Not authorized'));
    }

    const data = { ...req.body };
    if (typeof data.lessons === 'string') data.lessons = JSON.parse(data.lessons);
    if (req.file) data.image = req.file.cloudinaryUrl;

    course = await Course.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(ApiError.notFound('Course not found'));

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(ApiError.forbidden('Not authorized'));
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(ApiError.notFound('Course not found'));

    if (course.enrolledUsers.includes(req.user._id)) {
      return next(ApiError.badRequest('Already enrolled'));
    }

    if (course.maxEnrollment > 0 && course.enrolledUsers.length >= course.maxEnrollment) {
      return next(ApiError.badRequest('Course is full'));
    }

    course.enrolledUsers.push(req.user._id);
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    next(error);
  }
};

exports.unenrollFromCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(ApiError.notFound('Course not found'));

    course.enrolledUsers = course.enrolledUsers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await course.save();

    res.json({ success: true, message: 'Unenrolled successfully' });
  } catch (error) {
    next(error);
  }
};
