import express, { Router, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const router: Router = express.Router();

// Login route
const login: RequestHandler = async (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      console.log('No admin found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for admin:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        sub: admin._id,
        role: admin.role,
        email: admin.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for admin:', email);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create initial admin (development only)
const createAdmin: RequestHandler = async (req, res) => {
  try {
    console.log('Create admin attempt received:', req.body);
    
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not available in production' });
    }

    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    console.log('Existing admin check:', existingAdmin ? 'Found' : 'Not found');

    if (existingAdmin) {
      console.log('Admin already exists:', email);
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = new Admin({
      email,
      password,
      role: 'admin'
    });

    await admin.save();
    console.log('New admin created:', email);

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

router.post('/login', login);
router.post('/create-admin', createAdmin);

export default router; 