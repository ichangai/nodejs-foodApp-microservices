import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetVendors, GetVendorByID  } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor)
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorByID)


// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//     res.json({ message: 'Hello from admin!' });
// });



export {router as AdminRoute};