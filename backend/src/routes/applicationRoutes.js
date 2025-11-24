const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController');
const DocumentController = require('../controllers/DocumentController');
const upload = require('../config/multer');

// Application CRUD routes
router.post('/', ApplicationController.createApplication.bind(ApplicationController));
router.get('/', ApplicationController.getApplications.bind(ApplicationController));
router.get('/interviews/upcoming', ApplicationController.getUpcomingInterviews.bind(ApplicationController));
router.get('/:id', ApplicationController.getApplicationById.bind(ApplicationController));
router.put('/:id', ApplicationController.updateApplication.bind(ApplicationController));
router.delete('/:id', ApplicationController.deleteApplication.bind(ApplicationController));

// Stage and priority updates
router.patch('/:id/stage', ApplicationController.updateStage.bind(ApplicationController));
router.patch('/:id/priority', ApplicationController.updatePriority.bind(ApplicationController));

// Document routes
router.post('/:id/documents', upload.single('file'), DocumentController.uploadDocument.bind(DocumentController));
router.get('/:id/documents/:docId', DocumentController.downloadDocument.bind(DocumentController));
router.get('/:id/documents/:docId/metadata', DocumentController.getDocumentMetadata.bind(DocumentController));
router.delete('/:id/documents/:docId', DocumentController.deleteDocument.bind(DocumentController));

module.exports = router;
