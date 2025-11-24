# JATA - Job Application Tracking App

A production-grade MERN stack application for tracking job applications throughout the hiring process. Built with object-oriented principles, containerized with Docker, and designed for scalability.

## Features

### Core Functionality
- ✅ **Application Tracking** - Create, read, update, and delete job applications
- ✅ **Status Management** - Track applications through various stages (Submitted, Under Review, Assessment, Interviews, Offer)
- ✅ **Document Storage** - Upload and manage resumes, cover letters, and offer letters using GridFS
- ✅ **Interview Scheduling** - Store and track interview dates and times
- ✅ **Sorting & Filtering** - Sort by priority, stage, company, or date; filter by stage and priority
- ✅ **Analytics Dashboard** - View comprehensive statistics and success rates
- ✅ **User Management** - Basic CRUD operations for users (no authentication in MVP)

### Analytics
- Total applications count
- Response rate calculation
- Average time-to-offer metrics
- Success rate by company
- Success rate by position type
- Applications breakdown by stage and priority

## Tech Stack

### Frontend
- **React** 18.2 - UI library
- **Material-UI** 5.15 - Component library
- **React Router** 6.21 - Client-side routing
- **Axios** - HTTP client
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18 - Web framework
- **Mongoose** 8.0 - MongoDB ODM
- **GridFS** - File storage system
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **Rate Limiter** - API rate limiting

### Database
- **MongoDB** 7.0 - NoSQL database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server (for frontend)

## Project Structure

```
jata/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (OOP)
│   │   ├── middleware/      # Custom middleware
│   │   ├── scripts/         # Utility scripts
│   │   └── server.js        # Entry point
│   ├── Dockerfile           # Development Docker config
│   ├── Dockerfile.prod      # Production Docker config
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile           # Development Docker config
│   ├── Dockerfile.prod      # Production Docker config
│   ├── nginx.conf           # Nginx configuration
│   └── package.json
├── docker-compose.yml       # Development setup
├── docker-compose.prod.yml  # Production setup
├── SRS.md                   # Software Requirements Specification
└── README.md
```

## Getting Started

### Prerequisites
- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JATA
   ```

2. **Start the development environment**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - MongoDB on `localhost:27017`
   - Backend API on `localhost:5000`
   - Frontend app on `localhost:3000`

3. **Seed the database** (optional, for sample data)
   ```bash
   docker-compose exec backend npm run seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

### Production Setup

1. **Build and start production containers**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Access the application**
   - Application: http://localhost

### Stopping the Application

```bash
# Development
docker-compose down

# Production
docker-compose -f docker-compose.prod.yml down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications?userId=<id>` | Get all applications for user |
| GET | `/applications/:id` | Get specific application |
| POST | `/applications` | Create new application |
| PUT | `/applications/:id` | Update application |
| DELETE | `/applications/:id` | Delete application |
| PATCH | `/applications/:id/stage` | Update application stage |
| PATCH | `/applications/:id/priority` | Update priority level |
| GET | `/applications/interviews/upcoming?userId=<id>` | Get upcoming interviews |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/applications/:id/documents` | Upload document |
| GET | `/applications/:id/documents/:docId` | Download document |
| DELETE | `/applications/:id/documents/:docId` | Delete document |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/summary?userId=<id>` | Get overall statistics |
| GET | `/analytics/by-company?userId=<id>` | Success rate by company |
| GET | `/analytics/by-position?userId=<id>` | Success rate by position |
| GET | `/analytics/timeline?userId=<id>` | Timeline data |
| GET | `/analytics/attention?userId=<id>` | Items requiring attention |

### Example Requests

**Create User:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Create Application:**
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "positionTitle": "Senior Software Engineer",
    "company": "TechCorp",
    "location": "San Francisco, CA",
    "currentStage": "Submitted",
    "priority": "High",
    "applicationDate": "2025-01-20"
  }'
```

## Application Stages

1. **Submitted** - Application has been submitted
2. **Under Review** - Company is reviewing the application
3. **Assessment in Progress** - Completing assessments or tests
4. **Interviews** - Interview process ongoing
5. **Offer** - Offer received from company

## Priority Levels

- **High** - Urgent or highly desired positions
- **Medium** - Standard priority
- **Low** - Backup or exploratory applications

## Development

### Hot Reload
Both frontend and backend support hot reload in development mode. Changes to source files will automatically restart the servers.

### Running Tests
```bash
# Backend tests (when implemented)
docker-compose exec backend npm test

# Frontend tests (when implemented)
docker-compose exec frontend npm test
```

### Accessing MongoDB
```bash
# Connect to MongoDB shell
docker-compose exec mongodb mongosh jata
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongodb:27017/jata
CORS_ORIGIN=http://localhost:3000
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured cross-origin requests
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Express-validator for all inputs
- **NoSQL Injection Prevention** - Input sanitization
- **File Upload Limits** - 5MB maximum file size

## Future Enhancements

### Phase 2
- User authentication and authorization (JWT)
- Email notifications for upcoming interviews
- Calendar API integration
- Mobile responsiveness improvements
- Dark mode theme

### Phase 3
- Job board integration/scraping
- Application templates
- AI-powered resume optimization
- Company research integration
- Salary negotiation tracking

### Phase 4
- Multi-environment configurations (dev/staging/prod)
- Load balancing
- Database replication
- Caching layer (Redis)
- CDN for static assets

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000  # or :5000, :27017

# Kill the process or change ports in docker-compose.yml
```

### MongoDB connection issues
```bash
# Restart MongoDB container
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb
```

### Frontend not connecting to backend
- Verify backend is running: http://localhost:5000/api/health
- Check CORS settings in backend/.env
- Clear browser cache and cookies

### File upload issues
- Check file size (max 5MB)
- Verify file type (PDF, DOC, DOCX, TXT only)
- Check GridFS initialization in backend logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Authors

- You & Nav

## Acknowledgments

- Built following the Software Requirements Specification (SRS.md)
- Implements OOP principles and SOLID design patterns
- Production-grade architecture with scalability in mind
