"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerEditProfile = exports.CustomerProfile = exports.CustomerOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const NotificationUtility_1 = require("./../utility/NotificationUtility");
const PasswordUtility_1 = require("./../utility/PasswordUtility");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const models_1 = require("../models");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json({ message: inputErrors });
    }
    const { email, phone, password } = customerInputs;
    // Create Customer
    const salt = yield (0, PasswordUtility_1.GenerateSalt)();
    const userPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, NotificationUtility_1.GenerateOTP)();
    // check if customer email exists
    const existCustomer = yield models_1.Customer.findOne({ email: email });
    if (existCustomer) {
        return res.status(400).json({ message: "Customer already exists with the provided email" });
    }
    /*
    Testing to see if OTP password
    ::console.log(otp, expiry);
    ::return res.json('working')
    */
    const customer = yield models_1.Customer.create({
        email: email,
        phone: phone,
        password: userPassword,
        salt: salt,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    });
    if (customer) {
        // send the OTP to the customer
        yield (0, NotificationUtility_1.onRequestOTP)(otp, phone);
        // generate the signature
        const signature = yield (0, PasswordUtility_1.GenerateSignature)({
            _id: customer.id,
            email: customer.email,
            verified: customer.verified
        });
        // send the response to the customer
        return res.status(201).json({
            message: 'Customer created successfully',
            customer: {
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            },
            signature: signature
        });
    }
    return res.status(400).json({
        message: 'Error with Signup'
    });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomerLoginInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (inputErrors.length > 0) {
        return res.status(400).json({ message: inputErrors });
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            // generate the signature 
            const signature = yield (0, PasswordUtility_1.GenerateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            });
            //send the response to the customer
            return res.status(200).json({
                message: 'Customer verified successfully',
                customer: {
                    _id: customer.id,
                    email: customer.email,
                    verified: customer.verified
                },
                signature: signature
            });
        }
    }
    return res.status(400).json({
        success: "false",
        message: 'Error with Login'
    });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                // generate the signature
                const signature = yield (0, PasswordUtility_1.GenerateSignature)({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });
                return res.status(200).json({
                    message: 'Customer verified successfully',
                    customer: {
                        _id: updatedCustomerResponse.id,
                        email: updatedCustomerResponse.email,
                        verified: updatedCustomerResponse.verified
                    },
                    signature: signature
                });
            }
        }
    }
    return res.status(400).json({
        success: false,
        message: 'Error with Login'
    });
});
exports.CustomerVerify = CustomerVerify;
const CustomerOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, NotificationUtility_1.GenerateOTP)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            // send the OTP to the customer
            yield (0, NotificationUtility_1.onRequestOTP)(otp, profile.phone);
            return res.status(200).json({
                message: 'OTP sent to your registered phone number'
            });
        }
    }
    return res.status(400).json({
        success: false,
        message: 'Error with Request OTP'
    });
});
exports.CustomerOTP = CustomerOTP;
const CustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json({
                message: 'Customer profile',
                customer: {
                    _id: profile.id,
                    email: profile.email,
                    verified: profile.verified,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    address: profile.address,
                    lat: profile.lat,
                    lng: profile.lng
                }
            });
        }
    }
});
exports.CustomerProfile = CustomerProfile;
const CustomerEditProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = profileInputs.firstName;
            profile.lastName = profileInputs.lastName;
            profile.address = profileInputs.address;
            const result = yield profile.save();
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                profile: {
                    firstName: result.firstName,
                    lastName: result.lastName,
                    address: result.address
                }
            });
        }
    }
    return res.status(400).json({
        success: false,
        message: 'Error with Request OTP'
    });
});
exports.CustomerEditProfile = CustomerEditProfile;
//# sourceMappingURL=CustomerController.js.map