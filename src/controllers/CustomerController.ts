import { GenerateOTP, onRequestOTP } from './../utility/NotificationUtility';
import { GenerateSalt, GeneratePassword, GenerateSignature, ValidatePassword } from './../utility/PasswordUtility';
import express, { Request, Response, NextFunction } from 'express';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerInputs, CustomerLoginInputs, EditCustomerInputs } from '../dto';
import { Customer } from '../models';
export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body);

    const inputErrors = await validate(customerInputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
        return res.status(400).json({ message: inputErrors });
    }

    const { email, phone, password } = customerInputs;

    // Create Customer
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOTP();

    // check if customer email exists
    const existCustomer = await Customer.findOne({ email: email });

    if (existCustomer) {
        return res.status(400).json({ message: "Customer already exists with the provided email" });
    }

    /*
    Testing to see if OTP password
    ::console.log(otp, expiry);
    ::return res.json('working')
    */

    const customer = await Customer.create({
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
        await onRequestOTP(otp, phone);

        // generate the signature
        const signature = await GenerateSignature({
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
    })
}


export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

    const loginInputs = plainToClass(CustomerLoginInputs, req.body);

    const inputErrors = await validate(loginInputs, { validationError: { target: false } });

    if (inputErrors.length > 0) {
        return res.status(400).json({ message: inputErrors });
    }

    const { email, password } = loginInputs;

    const customer = await Customer.findOne({ email: email });

    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);

        if (validation) {

            // generate the signature 
            const signature = await GenerateSignature({
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
    })

}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                // generate the signature
                const signature = await GenerateSignature({
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
    })
}


export const CustomerOTP = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            const { otp, expiry } = GenerateOTP();

            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();

            // send the OTP to the customer
            await onRequestOTP(otp, profile.phone);

            return res.status(200).json({
                message: 'OTP sent to your registered phone number'
            });
        }
    }

    return res.status(400).json({
        success: false,
        message: 'Error with Request OTP'
    })

}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

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

}


export const CustomerEditProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    const profileInputs = plainToClass(EditCustomerInputs, req.body);

    const profileErrors = await validate(profileInputs, { validationError: { target: false } });

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            profile.firstName = profileInputs.firstName;
            profile.lastName = profileInputs.lastName;
            profile.address = profileInputs.address;

            const result = await profile.save();
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
    })

}


