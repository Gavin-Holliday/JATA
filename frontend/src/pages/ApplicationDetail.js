import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import applicationService from '../services/applicationService';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('resume');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplicationById(id);
      setApplication(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.deleteApplication(id);
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFileSelect = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleUploadDocument = async () => {
    if (!uploadFile) return;

    try {
      setUploading(true);
      await applicationService.uploadDocument(id, uploadFile, uploadType);
      setUploadDialog(false);
      setUploadFile(null);
      loadApplication();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadDocument = async (docId) => {
    try {
      const response = await applicationService.downloadDocument(id, docId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await applicationService.deleteDocument(id, docId);
        loadApplication();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !application) {
    return <Alert severity="error">{error || 'Application not found'}</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {application.positionTitle}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {application.company}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => navigate(`/applications/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Location</Typography>
            <Typography variant="body1" gutterBottom>{application.location || 'N/A'}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Application Link</Typography>
            {application.applicationLink ? (
              <a href={application.applicationLink} target="_blank" rel="noopener noreferrer">
                {application.applicationLink}
              </a>
            ) : (
              <Typography variant="body1">N/A</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip label={application.currentStage} color="primary" sx={{ mt: 1 }} />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">Priority</Typography>
            <Chip label={application.priority} color="warning" sx={{ mt: 1 }} />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">Application Date</Typography>
            <Typography variant="body1">{format(new Date(application.applicationDate), 'MMM dd, yyyy')}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">Interview Date</Typography>
            <Typography variant="body1">
              {application.interviewDateTime
                ? format(new Date(application.interviewDateTime), 'MMM dd, yyyy HH:mm')
                : 'N/A'}
            </Typography>
          </Grid>

          {application.jobRequirements && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Job Requirements</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {application.jobRequirements}
              </Typography>
            </Grid>
          )}

          {application.jobQualifications && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Job Qualifications</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {application.jobQualifications}
              </Typography>
            </Grid>
          )}

          {application.notes && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Notes</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {application.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Documents</Typography>
          <Button
            startIcon={<UploadIcon />}
            variant="contained"
            onClick={() => setUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {application.documents && application.documents.length > 0 ? (
          <List>
            {application.documents.map((doc) => (
              <ListItem key={doc._id}>
                <ListItemText
                  primary={doc.filename}
                  secondary={`Type: ${doc.type} • Uploaded: ${format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleDownloadDocument(doc._id)} color="primary">
                    <DownloadIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteDocument(doc._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">No documents uploaded yet.</Alert>
        )}
      </Paper>

      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Document Type"
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          >
            <MenuItem value="resume">Resume</MenuItem>
            <MenuItem value="coverLetter">Cover Letter</MenuItem>
            <MenuItem value="offerLetter">Offer Letter</MenuItem>
          </TextField>

          <Button variant="outlined" component="label" fullWidth>
            Choose File
            <input type="file" hidden onChange={handleFileSelect} />
          </Button>

          {uploadFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {uploadFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUploadDocument}
            variant="contained"
            disabled={!uploadFile || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationDetail;
