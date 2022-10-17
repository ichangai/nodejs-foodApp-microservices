import { validateSignature } from '../utility';
import { Request, Response, NextFunction } from 'express';

import { AuthPayload } from './../dto/Auth.dto';

declare global {
    namespace Express {
        interface Request {
        user?: AuthPayload;
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const validate = await validateSignature(req);

    if(validate) {
        next()
    } else {
        return res.json({"message": "You are not authorized to access this resource"})
    }
}