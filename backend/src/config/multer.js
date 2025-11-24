const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            originalname: file.originalname,
            uploadedBy: req.body.userId || 'unknown',
            uploadedAt: new Date()
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

// File filter for document types
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) ||
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.mimetype === 'text/plain';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;
