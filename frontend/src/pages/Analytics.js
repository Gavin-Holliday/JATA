import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import analyticsService from '../services/analyticsService';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color={color || 'primary.main'}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ color: color || 'primary.main', opacity: 0.7 }}>
        {icon}
      </Box>
    </Box>
  </Paper>
);

const Analytics = () => {
  const { currentUser } = useUser();
  const [summary, setSummary] = useState(null);
  const [companyStats, setCompanyStats] = useState([]);
  const [positionStats, setPositionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadAnalytics();
    }
  }, [currentUser]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryRes, companyRes, positionRes] = await Promise.all([
        analyticsService.getSummary(currentUser._id),
        analyticsService.getByCompany(currentUser._id),
        analyticsService.getByPosition(currentUser._id)
      ]);

      setSummary(summaryRes.data);
      setCompanyStats(companyRes.data || []);
      setPositionStats(positionRes.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="info">Please create a user first to view analytics.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Applications"
            value={summary?.totalApplications || 0}
            icon={<TimelineIcon fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Response Rate"
            value={`${summary?.responseRate || 0}%`}
            icon={<TrendingUpIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Offers Received"
            value={summary?.totalOffers || 0}
            icon={<CheckCircleIcon fontSize="large" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Time to Offer"
            value={`${summary?.averageTimeToOffer || 0} days`}
            icon={<ScheduleIcon fontSize="large" />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Applications by Stage */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Applications by Stage
        </Typography>
        <Grid container spacing={2}>
          {summary?.applicationsByStage && Object.entries(summary.applicationsByStage).map(([stage, count]) => (
            <Grid item xs={12} sm={6} md={4} key={stage}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body1">{stage}</Typography>
                <Typography variant="h6" color="primary">{count}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Success Rate by Company */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Success Rate by Company
        </Typography>
        {companyStats.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Applications</TableCell>
                  <TableCell align="right">Offers</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companyStats.slice(0, 10).map((stat) => (
                  <TableRow key={stat.company}>
                    <TableCell>{stat.company}</TableCell>
                    <TableCell align="right">{stat.totalApplications}</TableCell>
                    <TableCell align="right">{stat.offers}</TableCell>
                    <TableCell align="right">{stat.successRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No company data available yet.</Alert>
        )}
      </Paper>

      {/* Success Rate by Position */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Success Rate by Position
        </Typography>
        {positionStats.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell align="right">Applications</TableCell>
                  <TableCell align="right">Offers</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positionStats.slice(0, 10).map((stat) => (
                  <TableRow key={stat.positionTitle}>
                    <TableCell>{stat.positionTitle}</TableCell>
                    <TableCell align="right">{stat.totalApplications}</TableCell>
                    <TableCell align="right">{stat.offers}</TableCell>
                    <TableCell align="right">{stat.successRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No position data available yet.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Analytics;
