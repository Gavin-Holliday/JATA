const DocumentService = require('../services/DocumentService');
const ApplicationService = require('../services/ApplicationService');

/**
 * DocumentController - Handles HTTP requests for document operations
 * Manages GridFS file uploads and downloads
 */
class DocumentController {
  /**
   * Upload document to application
   * @route POST /api/applications/:id/documents
   */
  async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { type } = req.body;
      if (!type || !['resume', 'coverLetter', 'offerLetter'].includes(type)) {
        // Delete uploaded file if type is invalid
        await DocumentService.deleteFile(req.file.id);
        return res.status(400).json({
          success: false,
          message: 'Invalid document type. Must be: resume, coverLetter, or offerLetter'
        });
      }

      const documentData = {
        type,
        filename: req.file.originalname,
        fileId: req.file.id
      };

      const application = await ApplicationService.addDocument(
        req.params.id,
        documentData
      );

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: application
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && req.file.id) {
        try {
          await DocumentService.deleteFile(req.file.id);
        } catch (deleteError) {
          console.error('Error deleting file after upload failure:', deleteError);
        }
      }
      next(error);
    }
  }

  /**
   * Download document
   * @route GET /api/applications/:id/documents/:docId
   */
  async downloadDocument(req, res, next) {
    try {
      const application = await ApplicationService.getApplicationById(req.params.id);
      const document = application.documents.id(req.params.docId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      const { stream, metadata } = await DocumentService.getFileById(document.fileId);

      res.set({
        'Content-Type': metadata.contentType,
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': metadata.length
      });

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete document
   * @route DELETE /api/applications/:id/documents/:docId
   */
  async deleteDocument(req, res, next) {
    try {
      const application = await ApplicationService.getApplicationById(req.params.id);
      const document = application.documents.id(req.params.docId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      // Delete from GridFS
      await DocumentService.deleteFile(document.fileId);

      // Remove from application
      await ApplicationService.removeDocument(req.params.id, req.params.docId);

      res.status(200).json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get document metadata
   * @route GET /api/applications/:id/documents/:docId/metadata
   */
  async getDocumentMetadata(req, res, next) {
    try {
      const application = await ApplicationService.getApplicationById(req.params.id);
      const document = application.documents.id(req.params.docId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      const metadata = await DocumentService.getFileMetadata(document.fileId);

      res.status(200).json({
        success: true,
        data: {
          ...document.toObject(),
          fileMetadata: metadata
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentController();
