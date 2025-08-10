import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sequelize } from '../models';
import User from '../models/User';
import Skill from '../models/Skill';
import Service from '../models/Service';

dotenv.config();

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync database (force true to recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');
    
    // Create admin user
    const adminPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword
    });
    
    console.log('Admin user created.');
    
    // Create some skills
    const skills = [
  { name: 'JavaScript', category: 'Frontend', percentage: 90 },
  { name: 'TypeScript', category: 'Frontend', percentage: 85 },
  { name: 'React', category: 'Frontend', percentage: 80 },
  { name: 'Node.js', category: 'Backend', percentage: 85 },
  { name: 'Express', category: 'Backend', percentage: 80 },
  { name: 'PostgreSQL', category: 'Backend', percentage: 75 },
  { name: 'Git', category: 'Tool', percentage: 90 },
  { name: 'Problem Solving', category: 'SoftSkill', percentage: 95 }
];
    
    await Skill.bulkCreate(skills as any);
    console.log('Skills created.');
    
    // Create some services
    const services = [
      {
        title: 'Web Development',
        description: 'Building modern, responsive web applications with React, Node.js, and other technologies.',
        icon: 'code'
      },
      {
        title: 'API Development',
        description: 'Creating robust and scalable RESTful APIs using Node.js and Express.',
        icon: 'api'
      },
      {
        title: 'UI/UX Design',
        description: 'Designing intuitive and beautiful user interfaces for web applications.',
        icon: 'design'
      }
    ];
    
    await Service.bulkCreate(services);
    console.log('Services created.');
    
    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();