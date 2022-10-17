import { CustomerSignUp, CustomerLogin, CustomerVerify, CustomerOTP, CustomerProfile, CustomerEditProfile } from './../controllers/CustomerController';
import express, { Request, Response, NextFunction } from 'express';
import { Authenticate } from '../middleware';

const router = express.Router();

// Sign Up/ create Customer
router.post('/signup', CustomerSignUp)

// Login Customer
router.post('/login', CustomerLogin)


// Routes with Authentication
router.use(Authenticate);

// Verify Customer
router.patch('/verify', CustomerVerify)

// OTP Verification
router.get('/otp', CustomerOTP)

// Profile
router.get('/profile', CustomerProfile)

// Edit profile
router.patch('/profile', CustomerEditProfile)


export { router as CustomerRoute };