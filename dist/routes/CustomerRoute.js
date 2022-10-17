"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const CustomerController_1 = require("./../controllers/CustomerController");
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.CustomerRoute = router;
// Sign Up/ create Customer
router.post('/signup', CustomerController_1.CustomerSignUp);
// Login Customer
router.post('/login', CustomerController_1.CustomerLogin);
// Routes with Authentication
router.use(middleware_1.Authenticate);
// Verify Customer
router.patch('/verify', CustomerController_1.CustomerVerify);
// OTP Verification
router.get('/otp', CustomerController_1.CustomerOTP);
// Profile
router.get('/profile', CustomerController_1.CustomerProfile);
// Edit profile
router.patch('/profile', CustomerController_1.CustomerEditProfile);
//# sourceMappingURL=CustomerRoute.js.map