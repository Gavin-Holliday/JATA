# JATA - Job Application Tracking App
## Project Requirements & Technical Specification

**Version:** 1.0  
**Date:** October 20, 2025  
**Team:** You & Nav  
**Project Type:** Production-Grade MERN Stack Application

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Requirements](#requirements)
3. [Data Model](#data-model)
4. [Application Workflow](#application-workflow)
5. [Technical Architecture](#technical-architecture)
6. [API Design](#api-design)
7. [Development Workflow](#development-workflow)
8. [Future Enhancements](#future-enhancements)

---

## Project Overview

### Purpose
JATA is a job application tracking system designed for personal use to help manage and monitor job applications throughout the hiring process.

### Users
- Initial users: You and Nav (personal use)
- Target capacity: 100+ users (for scalability testing)

### Core Philosophy
- **Production-grade development practices**
- **Object-oriented principles**
- **Containerized for scalability**
- **Security-first approach**
- **CI/CD integration**

---

## Requirements

### Functional Requirements (MVP - Bare Bones)

#### Core Features
1. ✅ **Application Tracking**
   - Create, read, update, delete job applications
   - Track applications through various stages
   - Store application metadata (dates, status, links)

2. ✅ **Status Management**
   - Move applications through defined stages
   - User-controlled stage transitions
   - Visual status indicators

3. ✅ **Document Storage**
   - Upload and store resumes
   - Upload and store cover letters
   - Upload and store offer letters
   - MongoDB containerized storage

4. ✅ **Interview Scheduling**
   - Store single interview date/time per application
   - Display upcoming interviews

5. ✅ **Sorting & Filtering**
   - Sort by: Priority, Stage, Company
   - Order applications by importance
   - Filter by current stage

6. ✅ **Analytics Dashboard**
   - Total applications count
   - Response rate calculation
   - Time-to-offer metrics
   - Success rate by company
   - Success rate by position type

#### Out of Scope (For Now)
- ❌ User authentication (deferred to future)
- ❌ Job board scraping/integration
- ❌ Email notifications
- ❌ Calendar API integration
- ❌ Multiple interviews per application
- ❌ Environment-specific configurations (dev/staging/prod)

### Non-Functional Requirements

| Requirement | Specification |
|------------|---------------|
| **Scalability** | Support 100+ concurrent users |
| **Security** | Secure data handling, prepared for future auth |
| **Containerization** | Full Docker containerization via Docker Compose |
| **Performance** | Fast response times, optimized queries |
| **Maintainability** | Clean code, OOP principles, documented |

---

## Data Model

### Entity Relationship Overview

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────────┐
│   Application   │
└─────────────────┘
```

### Collections

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  profileInfo: {
    // Additional profile fields as needed
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Fields:**
- `name`: User's full name
- `email`: User's email address
- `profileInfo`: Flexible object for additional user data
- `createdAt`: Account creation timestamp
- `updatedAt`: Last profile update timestamp

---

#### **Applications Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  
  // Job Details
  positionTitle: String,
  company: String,
  jobRequirements: String,
  jobQualifications: String,
  location: String,
  applicationLink: String,
  
  // Status Tracking
  currentStage: String, // Enum: see stages below
  priority: String, // Enum: 'Low', 'Medium', 'High'
  
  // Dates
  applicationDate: Date,
  lastUpdatedDate: Date,
  interviewDateTime: Date, // Optional
  
  // Documents (Embedded)
  documents: [
    {
      type: String, // 'resume', 'coverLetter', 'offerLetter'
      filename: String,
      fileData: Binary, // GridFS reference or binary data
      uploadedAt: Date
    }
  ],
  
  // Additional Info
  notes: String, // Extra information field
  
  createdAt: Date,
  updatedAt: Date
}
```

**Key Fields Explained:**
- `userId`: Links application to specific user (ready for multi-user)
- `currentStage`: Current position in application pipeline
- `priority`: User-assigned importance level
- `documents`: Embedded array of stored documents
- `notes`: Catch-all for extra information

---

## Application Workflow

### Application Stage Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────────┐
│  Submitted  │ ──> │ Under Review │ ──> │ Assessment in        │
└─────────────┘     └──────────────┘     │ Progress             │
                                          └──────────┬───────────┘
                                                     │
                                                     ▼
                    ┌───────────┐           ┌──────────────┐
                    │   Offer   │ <──────── │  Interviews  │
                    └─────┬─────┘           └──────────────┘
                          │
                    ┌─────▼──────┐
                    │  Accepted  │
                    │     or     │
                    │  Rejected  │
                    └────────────┘
```

### Stage Definitions

| Stage | Description |
|-------|-------------|
| **Submitted** | Application has been submitted to company |
| **Under Review** | Company is reviewing the application |
| **Assessment in Progress** | Candidate is completing assessments/tests |
| **Interviews** | Interview process ongoing |
| **Offer** | Offer received from company |

### Stage Transition Rules
- ✅ User can manually move application to any stage
- ✅ Stages can move forward or backward
- ❌ If **Rejected**: Create NEW application for reapplication (not same record)

### Priority Levels
- **High**: Urgent or highly desired positions
- **Medium**: Standard priority
- **Low**: Backup or exploratory applications

---

## Technical Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│                    Port: 3000                        │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP REST API
                        ▼
┌─────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)             │
│                    Port: 5000                        │
└───────────────────────┬─────────────────────────────┘
                        │ Mongoose ODM
                        ▼
┌─────────────────────────────────────────────────────┐
│                MongoDB (Containerized)               │
│                    Port: 27017                       │
└─────────────────────────────────────────────────────┘
```

### Containerization Strategy

**Docker Compose Services:**

```yaml
services:
  # Frontend Container
  frontend:
    - React application
    - Port: 3000
    - Volume mounts for hot reload
  
  # Backend Container
  backend:
    - Node.js + Express API
    - Port: 5000
    - Environment variables for DB connection
  
  # Database Container
  mongodb:
    - MongoDB instance
    - Port: 27017
    - Persistent volume for data
    - Separated from application logic
```

### Technology Choices

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React | UI components and state management |
| **State Management** | React (Context/useState) | Simple state for MVP |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB | NoSQL document storage |
| **ODM** | Mongoose | Schema validation and data modeling |
| **Containerization** | Docker + Docker Compose | Development and deployment |

---

## API Design

### RESTful Endpoints

#### **Users**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user profile |

#### **Applications**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications for user |
| GET | `/api/applications/:id` | Get specific application |
| POST | `/api/applications` | Create new application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| PATCH | `/api/applications/:id/stage` | Update application stage |
| PATCH | `/api/applications/:id/priority` | Update priority level |

#### **Documents**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:id/documents` | Upload document |
| GET | `/api/applications/:id/documents/:docId` | Download document |
| DELETE | `/api/applications/:id/documents/:docId` | Delete document |

#### **Analytics**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get overall statistics |
| GET | `/api/analytics/by-company` | Success rate by company |
| GET | `/api/analytics/by-position` | Success rate by position type |

### Sample Request/Response

**POST /api/applications**
```json
Request:
{
  "userId": "507f1f77bcf86cd799439011",
  "positionTitle": "Senior Software Engineer",
  "company": "TechCorp",
  "jobRequirements": "5+ years experience...",
  "jobQualifications": "BS in CS...",
  "location": "San Francisco, CA",
  "applicationLink": "https://techcorp.com/jobs/123",
  "currentStage": "Submitted",
  "priority": "High",
  "applicationDate": "2025-10-20"
}

Response:
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "positionTitle": "Senior Software Engineer",
  "company": "TechCorp",
  "currentStage": "Submitted",
  "priority": "High",
  "applicationDate": "2025-10-20T00:00:00.000Z",
  "createdAt": "2025-10-20T10:30:00.000Z",
  "updatedAt": "2025-10-20T10:30:00.000Z"
}
```

---

## Development Workflow

### Version Control Strategy

```
main (production-ready)
  │
  ├── dev (integration branch)
      │
      ├── feature/your-branch
      │
      └── feature/nav-branch
```

**Branching Model:**
1. `main`: Production-ready code only
2. `dev`: Integration branch for testing features together
3. `feature/your-branch`: Your personal development branch
4. `feature/nav-branch`: Nav's personal development branch

**Workflow:**
1. Create feature branch from `dev`
2. Develop and commit to feature branch
3. Create Pull Request to `dev`
4. Code review by team member
5. Merge to `dev` after approval
6. Test on `dev`
7. Merge `dev` to `main` when stable

### Project Structure

```
jata/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── JATA_Project_Specification.md (this document)
```

### Object-Oriented Principles

**Backend (Node.js):**
- Use **classes** for services and controllers
- Implement **repository pattern** for data access
- Use **dependency injection** where appropriate
- Follow **SOLID principles**

**Example Structure:**
```javascript
// ApplicationService.js
class ApplicationService {
  constructor(applicationRepository) {
    this.repository = applicationRepository;
  }
  
  async createApplication(data) {
    // Business logic
  }
  
  async getApplicationsByStage(userId, stage) {
    // Business logic
  }
}
```

---

## Analytics Specifications

### Metrics to Track

#### 1. **Total Applications**
- Count of all applications in system
- Broken down by stage

#### 2. **Response Rate**
```
Response Rate = (Applications beyond "Submitted") / (Total Applications) × 100
```

#### 3. **Time-to-Offer**
```
Average time from "Application Date" to reaching "Offer" stage
```

#### 4. **Success Rate by Company**
```
Success Rate = (Offers received) / (Total applications to company) × 100
```

#### 5. **Success Rate by Position Type**
```
Success Rate = (Offers received) / (Total applications for position type) × 100
```

### Analytics Dashboard Layout

```
┌────────────────────────────────────────────────────┐
│            JATA Analytics Dashboard                │
├────────────────────────────────────────────────────┤
│                                                    │
│  Total Applications: 45                            │
│  Response Rate: 68%                                │
│  Avg Time to Offer: 21 days                        │
│                                                    │
├────────────────────────────────────────────────────┤
│  Applications by Stage                             │
│  ┌──────────────────────────────────────┐         │
│  │ Submitted:              12            │         │
│  │ Under Review:            8            │         │
│  │ Assessment in Progress:  5            │         │
│  │ Interviews:              7            │         │
│  │ Offer:                   3            │         │
│  └──────────────────────────────────────┘         │
├────────────────────────────────────────────────────┤
│  Success Rate by Company                           │
│  TechCorp:      25% (1/4)                          │
│  DataSystems:   50% (2/4)                          │
│  CloudWorks:    33% (1/3)                          │
└────────────────────────────────────────────────────┘
```

---

## Sorting & Filtering Requirements

### Sort Options

| Sort By | Order Options |
|---------|---------------|
| **Priority** | High → Medium → Low |
| **Stage** | Submitted → Under Review → Assessment → Interviews → Offer |
| **Company** | Alphabetical (A-Z or Z-A) |
| **Date Applied** | Newest → Oldest or Oldest → Newest |

### Filter Options
- Filter by stage (show only specific stage)
- Filter by priority level
- Filter by date range
- Search by company name or position title

---

## Security Considerations

### Current (Without Auth)
- Input validation on all API endpoints
- Sanitize user inputs to prevent NoSQL injection
- Rate limiting on API endpoints
- CORS configuration
- Secure headers (Helmet.js)

### Future (With Auth)
- JWT token-based authentication
- Password hashing (bcrypt)
- Role-based access control
- Refresh token rotation
- HTTPS enforcement

---

## CI/CD Pipeline (To Be Implemented)

### Pipeline Stages
1. **Lint**: Code style checking
2. **Build**: Compile/bundle application
3. **Test**: Run automated tests
4. **Security Scan**: Vulnerability checking
5. **Deploy**: Container deployment

### Tools to Consider
- GitHub Actions / GitLab CI
- Docker Hub for image registry
- Automated testing frameworks
- Code quality tools (ESLint, Prettier)

---

## Future Enhancements

### Phase 2 (Post-MVP)
- ✨ User authentication and authorization
- ✨ Multiple interviews per application
- ✨ Email notifications for upcoming interviews
- ✨ Calendar API integration
- ✨ Mobile responsiveness improvements
- ✨ Dark mode

### Phase 3 (Advanced Features)
- ✨ Job board integration/scraping
- ✨ Application templates
- ✨ Collaborative features (share applications)
- ✨ AI-powered resume optimization
- ✨ Company research integration
- ✨ Salary negotiation tracking

### Phase 4 (Scaling)
- ✨ Environment-specific configurations (dev/staging/prod)
- ✨ Load balancing
- ✨ Database replication
- ✨ Caching layer (Redis)
- ✨ CDN for static assets

---

## Testing Strategy (To Be Defined)

### Testing Levels
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user workflows
- **Performance Tests**: Load and stress testing

### Coverage Goals
- Target: 80%+ code coverage
- Critical paths: 100% coverage

---

## Error Handling & Logging (To Be Defined)

### Error Handling Strategy
- Centralized error handling middleware
- Consistent error response format
- User-friendly error messages
- Detailed server-side logging

### Logging Strategy
- Request/response logging
- Error logging with stack traces
- Performance metrics
- Audit trail for data changes

---

## Quick Reference

### Application Stages
1. Submitted
2. Under Review
3. Assessment in Progress
4. Interviews
5. Offer

### Priority Levels
- High
- Medium
- Low

### Document Types
- Resume
- Cover Letter
- Offer Letter

### Key Technologies
- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Container**: Docker + Docker Compose
- **API Style**: RESTful

---

## Next Steps

### Immediate Actions
1. ✅ Set up Git repository
2. ✅ Initialize project structure
3. ✅ Create Docker Compose configuration
4. ✅ Set up development environment
5. ✅ Design database schemas in Mongoose
6. ✅ Create API endpoints (backend)
7. ✅ Build React components (frontend)
8. ✅ Implement sorting and filtering
9. ✅ Build analytics dashboard
10. ✅ Test end-to-end workflows

---

**Document Maintained By:** Team (You & Nav)  
**Last Updated:** October 20, 2025  
**Version:** 1.0
