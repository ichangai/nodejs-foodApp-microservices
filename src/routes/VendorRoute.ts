import { VendorLogin, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, AddFood, GetFoods, UpdateVendorCoverImage } from './../controllers/VendorController';
import express, { Request, Response, NextFunction } from 'express';
import { Vendor } from '../models';
import { Authenticate } from '../middleware';
import multer from 'multer';


const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
})


const images = multer({ storage: imageStorage }).array('images', 10)

router.post('/login', VendorLogin);

router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);
router.patch('/coverimage', images, UpdateVendorCoverImage);


router.post('/food', images, AddFood);
router.get('/food', GetFoods);

export { router as VendorRoute };