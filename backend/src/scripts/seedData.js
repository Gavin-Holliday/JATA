require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Sample users
const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileInfo: {
      phone: '555-0100',
      location: 'San Francisco, CA'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    profileInfo: {
      phone: '555-0200',
      location: 'New York, NY'
    }
  }
];

// Sample applications (will be populated after users are created)
const getApplications = (userId) => [
  {
    userId,
    positionTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    jobRequirements: '5+ years of experience with React, Node.js, and MongoDB. Strong problem-solving skills.',
    jobQualifications: 'Bachelor\'s degree in Computer Science or related field. Experience with cloud platforms.',
    location: 'San Francisco, CA',
    applicationLink: 'https://techcorp.com/jobs/123',
    currentStage: 'Interviews',
    priority: 'High',
    applicationDate: new Date('2025-01-15'),
    interviewDateTime: new Date('2025-02-01T14:00:00'),
    notes: 'Had initial phone screen. Very positive feedback.'
  },
  {
    userId,
    positionTitle: 'Full Stack Developer',
    company: 'DataSystems Inc',
    jobRequirements: 'Experience with MERN stack, RESTful APIs, and Docker.',
    jobQualifications: 'Strong communication skills. Experience in Agile environments.',
    location: 'Remote',
    applicationLink: 'https://datasystems.com/careers/456',
    currentStage: 'Under Review',
    priority: 'Medium',
    applicationDate: new Date('2025-01-20'),
    notes: 'Applied through LinkedIn'
  },
  {
    userId,
    positionTitle: 'Frontend Developer',
    company: 'CloudWorks',
    jobRequirements: 'Expert knowledge of React, TypeScript, and modern CSS frameworks.',
    jobQualifications: '3+ years of frontend development experience.',
    location: 'Austin, TX',
    applicationLink: 'https://cloudworks.io/jobs/789',
    currentStage: 'Submitted',
    priority: 'Low',
    applicationDate: new Date('2025-01-25'),
    notes: ''
  },
  {
    userId,
    positionTitle: 'Backend Engineer',
    company: 'TechCorp',
    jobRequirements: 'Strong experience with Node.js, databases, and microservices architecture.',
    jobQualifications: 'Bachelor\'s degree and 4+ years of experience.',
    location: 'San Francisco, CA',
    applicationLink: 'https://techcorp.com/jobs/234',
    currentStage: 'Assessment in Progress',
    priority: 'High',
    applicationDate: new Date('2025-01-18'),
    notes: 'Completed coding assessment. Waiting for results.'
  },
  {
    userId,
    positionTitle: 'DevOps Engineer',
    company: 'InnovateTech',
    jobRequirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines.',
    jobQualifications: 'Strong Linux skills and automation experience.',
    location: 'Seattle, WA',
    applicationLink: 'https://innovatetech.com/openings/567',
    currentStage: 'Offer',
    priority: 'High',
    applicationDate: new Date('2025-01-10'),
    notes: 'Received offer! Great benefits package.'
  },
  {
    userId,
    positionTitle: 'Software Engineer',
    company: 'StartupXYZ',
    jobRequirements: 'Full-stack development skills. Startup experience preferred.',
    jobQualifications: '2+ years of experience. Passion for building products.',
    location: 'Boston, MA',
    applicationLink: 'https://startupxyz.com/jobs/890',
    currentStage: 'Submitted',
    priority: 'Medium',
    applicationDate: new Date('2025-01-22'),
    notes: 'Looks like an exciting opportunity'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create applications for each user
    let totalApplications = 0;
    for (const user of createdUsers) {
      const applications = getApplications(user._id);
      await Application.insertMany(applications);
      totalApplications += applications.length;
      console.log(`Created ${applications.length} applications for ${user.name}`);
    }

    console.log(`\nSeed completed successfully!`);
    console.log(`Total users: ${createdUsers.length}`);
    console.log(`Total applications: ${totalApplications}`);
    console.log('\nSample login credentials:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run seed
connectDB().then(() => {
  seedDatabase();
});
