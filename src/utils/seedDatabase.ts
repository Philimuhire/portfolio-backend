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
      { name: 'JavaScript', category: 'Frontend', level: 'Advanced' },
      { name: 'TypeScript', category: 'Frontend', level: 'Advanced' },
      { name: 'React', category: 'Frontend', level: 'Advanced' },
      { name: 'Node.js', category: 'Backend', level: 'Advanced' },
      { name: 'Express', category: 'Backend', level: 'Advanced' },
      { name: 'PostgreSQL', category: 'Backend', level: 'Intermediate' },
      { name: 'Git', category: 'Tool', level: 'Advanced' },
      { name: 'Problem Solving', category: 'SoftSkill', level: 'Advanced' }
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