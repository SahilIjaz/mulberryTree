const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const ApiError = require('../utils/apiError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Only image files (jpeg, png, webp, gif) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadSingle = upload.single('image');

const uploadToCloudinary = (folder = 'mulberrytree') => {
  return (req, res, next) => {
    if (!req.file) return next();

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return next(ApiError.internal('Image upload failed'));
        req.file.cloudinaryUrl = result.secure_url;
        req.file.cloudinaryId = result.public_id;
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  };
};

module.exports = { uploadSingle, uploadToCloudinary };
