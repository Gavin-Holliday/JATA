import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const ApplicationCard = ({ application, onDelete, onStageChange }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Submitted':
        return 'default';
      case 'Under Review':
        return 'primary';
      case 'Assessment in Progress':
        return 'info';
      case 'Interviews':
        return 'warning';
      case 'Offer':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {application.positionTitle}
          </Typography>
          <Chip
            label={application.priority}
            color={getPriorityColor(application.priority)}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BusinessIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {application.company}
          </Typography>
        </Box>

        {application.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {application.location}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Applied: {format(new Date(application.applicationDate), 'MMM dd, yyyy')}
          </Typography>
        </Box>

        {application.interviewDateTime && (
          <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" color="text.primary">
              Interview: {format(new Date(application.interviewDateTime), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Box>
        )}

        <Chip
          label={application.currentStage}
          color={getStageColor(application.currentStage)}
          sx={{ mt: 1 }}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          onClick={() => navigate(`/applications/${application._id}`)}
        >
          View Details
        </Button>
        <Box>
          <IconButton
            size="small"
            onClick={() => navigate(`/applications/${application._id}/edit`)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(application._id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ApplicationCard;
