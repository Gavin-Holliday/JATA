const mongoose = require('mongoose');
const { getGridFSBucket } = require('../config/database');

/**
 * DocumentService - Handles GridFS document operations
 * Provides abstraction layer for file storage
 */
class DocumentService {
  /**
   * Get file from GridFS by ID
   * @param {string} fileId - File ID
   * @returns {Object} ReadStream and file metadata
   */
  async getFileById(fileId) {
    const bucket = getGridFSBucket();
    const _id = new mongoose.Types.ObjectId(fileId);

    // Get file metadata
    const files = await bucket.find({ _id }).toArray();

    if (!files || files.length === 0) {
      throw new Error('File not found');
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(_id);

    return {
      stream: downloadStream,
      metadata: {
        filename: file.filename,
        contentType: file.contentType || 'application/octet-stream',
        length: file.length,
        uploadDate: file.uploadDate
      }
    };
  }

  /**
   * Delete file from GridFS by ID
   * @param {string} fileId - File ID
   * @returns {Promise<void>}
   */
  async deleteFile(fileId) {
    const bucket = getGridFSBucket();
    const _id = new mongoose.Types.ObjectId(fileId);

    try {
      await bucket.delete(_id);
    } catch (error) {
      if (error.message.includes('FileNotFound')) {
        throw new Error('File not found');
      }
      throw error;
    }
  }

  /**
   * Get all files metadata
   * @returns {Promise<Array>} Array of file metadata
   */
  async getAllFiles() {
    const bucket = getGridFSBucket();
    return await bucket.find().toArray();
  }

  /**
   * Get file metadata by ID
   * @param {string} fileId - File ID
   * @returns {Promise<Object>} File metadata
   */
  async getFileMetadata(fileId) {
    const bucket = getGridFSBucket();
    const _id = new mongoose.Types.ObjectId(fileId);

    const files = await bucket.find({ _id }).toArray();

    if (!files || files.length === 0) {
      throw new Error('File not found');
    }

    return files[0];
  }

  /**
   * Check if file exists
   * @param {string} fileId - File ID
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(fileId) {
    try {
      await this.getFileMetadata(fileId);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new DocumentService();
