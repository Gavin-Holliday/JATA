import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          placeholder="Company or Position"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Stage</InputLabel>
          <Select
            value={filters.stage || ''}
            label="Stage"
            onChange={(e) => handleChange('stage', e.target.value)}
          >
            <MenuItem value="">All Stages</MenuItem>
            <MenuItem value="Submitted">Submitted</MenuItem>
            <MenuItem value="Under Review">Under Review</MenuItem>
            <MenuItem value="Assessment in Progress">Assessment in Progress</MenuItem>
            <MenuItem value="Interviews">Interviews</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            label="Priority"
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'date'}
            label="Sort By"
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <MenuItem value="date">Application Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="stage">Stage</MenuItem>
            <MenuItem value="company">Company</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={filters.order || 'desc'}
            label="Order"
            onChange={(e) => handleChange('order', e.target.value)}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default FilterBar;
