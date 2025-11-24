const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;
let gridfsBucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize GridFS
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'uploads'
    });

    gfs = Grid(conn.connection.db, mongoose.mongo);
    gfs.collection('uploads');

    console.log('GridFS initialized successfully');

    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const getGFS = () => {
  if (!gfs) {
    throw new Error('GridFS not initialized. Call connectDB first.');
  }
  return gfs;
};

const getGridFSBucket = () => {
  if (!gridfsBucket) {
    throw new Error('GridFSBucket not initialized. Call connectDB first.');
  }
  return gridfsBucket;
};

module.exports = { connectDB, getGFS, getGridFSBucket };
