const mongoose = require('mongoose');

// Document schema for embedded documents
const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['resume', 'coverLetter', 'offerLetter']
    },
    filename: {
      type: String,
      required: true
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },

    // Job Details
    positionTitle: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
      maxlength: [200, 'Position title cannot exceed 200 characters']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters']
    },
    jobRequirements: {
      type: String,
      trim: true,
      maxlength: [2000, 'Job requirements cannot exceed 2000 characters']
    },
    jobQualifications: {
      type: String,
      trim: true,
      maxlength: [2000, 'Job qualifications cannot exceed 2000 characters']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    applicationLink: {
      type: String,
      trim: true,
      maxlength: [500, 'Application link cannot exceed 500 characters']
    },

    // Status Tracking
    currentStage: {
      type: String,
      required: [true, 'Current stage is required'],
      enum: {
        values: ['Submitted', 'Under Review', 'Assessment in Progress', 'Interviews', 'Offer'],
        message: '{VALUE} is not a valid stage'
      },
      default: 'Submitted'
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'Medium'
    },

    // Dates
    applicationDate: {
      type: Date,
      required: [true, 'Application date is required'],
      default: Date.now
    },
    lastUpdatedDate: {
      type: Date,
      default: Date.now
    },
    interviewDateTime: {
      type: Date
    },

    // Documents (Embedded)
    documents: [documentSchema],

    // Additional Info
    notes: {
      type: String,
      trim: true,
      maxlength: [5000, 'Notes cannot exceed 5000 characters']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
applicationSchema.index({ userId: 1, currentStage: 1 });
applicationSchema.index({ userId: 1, priority: 1 });
applicationSchema.index({ userId: 1, company: 1 });
applicationSchema.index({ userId: 1, applicationDate: -1 });

// Middleware to update lastUpdatedDate before saving
applicationSchema.pre('save', function(next) {
  this.lastUpdatedDate = new Date();
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
