const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Department = require('./models/Department');
const SlaConfig = require('./models/SlaConfig');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await SlaConfig.deleteMany({});

    // Create Department
    const csDept = await Department.create({ name: 'Computer Science' });

    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const users = [
      { name: 'Admin User', email: 'admin@college.edu', passwordHash, role: 'Admin' },
      { name: 'Dr. Dean', email: 'dean@college.edu', passwordHash, role: 'Dean' },
      { name: 'Dr. Smith (HOD)', email: 'hod.cs@college.edu', passwordHash, role: 'HOD', departmentId: csDept._id },
      { name: 'Prof. Johnson', email: 'mentor.cs@college.edu', passwordHash, role: 'Mentor', departmentId: csDept._id },
      { name: 'Mr. Davis', email: 'coordinator.cs@college.edu', passwordHash, role: 'Coordinator', departmentId: csDept._id },
      { name: 'Ms. Taylor', email: 'teacher.cs@college.edu', passwordHash, role: 'Teacher', departmentId: csDept._id },
      { name: 'Alice Student', email: 'alice@student.college.edu', passwordHash, role: 'Student', departmentId: csDept._id, classId: 'CS-A' }
    ];

    await User.insertMany(users);
    console.log('Users created successfully');

    // Create SLA Configs
    const slaConfigs = [
      { requestType: 'Attendance Correction', slaHours: 24 },
      { requestType: 'Event Participation', slaHours: 24 },
      { requestType: 'Medical Leave', slaHours: 48 },
      { requestType: 'Bonafide Certificate', slaHours: 72 }
    ];

    await SlaConfig.insertMany(slaConfigs);
    console.log('SLA configs created successfully');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
