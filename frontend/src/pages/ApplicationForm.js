import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { useUser } from '../context/UserContext';
import applicationService from '../services/applicationService';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    positionTitle: '',
    company: '',
    jobRequirements: '',
    jobQualifications: '',
    location: '',
    applicationLink: '',
    currentStage: 'Submitted',
    priority: 'Medium',
    applicationDate: new Date().toISOString().split('T')[0],
    interviewDateTime: '',
    notes: ''
  });

  useEffect(() => {
    if (isEdit) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplicationById(id);
      const app = response.data;

      setFormData({
        positionTitle: app.positionTitle || '',
        company: app.company || '',
        jobRequirements: app.jobRequirements || '',
        jobQualifications: app.jobQualifications || '',
        location: app.location || '',
        applicationLink: app.applicationLink || '',
        currentStage: app.currentStage || 'Submitted',
        priority: app.priority || 'Medium',
        applicationDate: new Date(app.applicationDate).toISOString().split('T')[0],
        interviewDateTime: app.interviewDateTime ? new Date(app.interviewDateTime).toISOString().slice(0, 16) : '',
        notes: app.notes || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('Please select a user first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        userId: currentUser._id,
        interviewDateTime: formData.interviewDateTime || undefined
      };

      if (isEdit) {
        await applicationService.updateApplication(id, submitData);
      } else {
        await applicationService.createApplication(submitData);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="info">Please create a user first.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Application' : 'New Application'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Position Title"
                name="positionTitle"
                value={formData.positionTitle}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Link"
                name="applicationLink"
                type="url"
                value={formData.applicationLink}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                select
                label="Current Stage"
                name="currentStage"
                value={formData.currentStage}
                onChange={handleChange}
              >
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="Assessment in Progress">Assessment in Progress</MenuItem>
                <MenuItem value="Interviews">Interviews</MenuItem>
                <MenuItem value="Offer">Offer</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Application Date"
                name="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interview Date & Time"
                name="interviewDateTime"
                type="datetime-local"
                value={formData.interviewDateTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Job Requirements"
                name="jobRequirements"
                value={formData.jobRequirements}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Job Qualifications"
                name="jobQualifications"
                value={formData.jobQualifications}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : isEdit ? 'Update Application' : 'Create Application'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ApplicationForm;
