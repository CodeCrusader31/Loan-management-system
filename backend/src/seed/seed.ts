import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { connectDB } from '../config/db';
import { Role } from '../types';

dotenv.config();

const users: Array<{ name: string; email: string; password: string; role: Role }> = [
  { name: 'Admin', email: 'admin@test.com', password: 'password123', role: 'ADMIN' },
  { name: 'Sales Exec', email: 'sales@test.com', password: 'password123', role: 'SALES' },
  { name: 'Sanction Exec', email: 'sanction@test.com', password: 'password123', role: 'SANCTION' },
  { name: 'Disburse Exec', email: 'disburse@test.com', password: 'password123', role: 'DISBURSEMENT' },
  { name: 'Collection Exec', email: 'collection@test.com', password: 'password123', role: 'COLLECTION' },
  { name: 'Test Borrower', email: 'borrower@test.com', password: 'password123', role: 'BORROWER' },
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing users...');
    await User.deleteMany();
    
    console.log('Seeding predefined users...');
    await User.create(users);
    
    console.log('✅ Seeding completed successfully!');
    process.exit();
  } catch (error) { 
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
