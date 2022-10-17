import { AuthPayload } from './../dto/Auth.dto';
import { APP_SECRET } from './../config/index';


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

// encrypting the password
export const GenerateSalt = async () => {
    return await bcrypt.genSalt(10);
}

// encrypting the password 
export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}


export const ValidatePassword =  async (enteredPassword: string, savedPassword: string, salt: string) => {
   
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}


export const GenerateSignature = (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET || 'secret', { expiresIn: '7d' });
}

// We will get signature from the client and verify it
// if it is valid then will assign the payload to the request
export const validateSignature = async (req: Request) => {
    const signature = req.get('Authorization');

    if (signature) {
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
        req.user = payload;

        return true;
    }
    return false
}