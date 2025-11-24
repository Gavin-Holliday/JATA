import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import ApplicationCard from '../components/ApplicationCard';
import FilterBar from '../components/FilterBar';
import { useUser } from '../context/UserContext';
import applicationService from '../services/applicationService';

const Dashboard = () => {
  const { currentUser } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    search: '',
    stage: '',
    priority: '',
    sortBy: 'date',
    order: 'desc'
  });

  useEffect(() => {
    if (currentUser) {
      loadApplications();
    }
  }, [currentUser, filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      if (filters.search) filterParams.search = filters.search;
      if (filters.stage) filterParams.stage = filters.stage;
      if (filters.priority) filterParams.priority = filters.priority;

      const sortParams = {
        sortBy: filters.sortBy,
        order: filters.order
      };

      const response = await applicationService.getApplications(
        currentUser._id,
        filterParams,
        sortParams
      );
      setApplications(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      showSnackbar('Error loading applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.deleteApplication(id);
        setApplications(applications.filter(app => app._id !== id));
        showSnackbar('Application deleted successfully', 'success');
      } catch (err) {
        showSnackbar('Error deleting application', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="info">Please create a user first to start tracking applications.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : applications.length === 0 ? (
        <Alert severity="info">
          No applications found. Start by creating your first application!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid item xs={12} sm={6} md={4} key={application._id}>
              <ApplicationCard
                application={application}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
