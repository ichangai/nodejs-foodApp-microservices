import { CreateFoodInput } from './../dto/Food.dto';
import { EditVendorInputs } from './../dto/vendor.dto';
import { ValidatePassword, GenerateSignature } from './../utility/PasswordUtility';
import { FindVendor } from './AdminController';
import { Request, Response, NextFunction } from 'express'
import { VendorLoginInputs } from '../dto'
import { Food } from '../models/Food';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await FindVendor('', email);

    if (existingVendor !== null) {

        // validation and give access
        const validation = await ValidatePassword(password,
            existingVendor.password,
            existingVendor.salt);

        if (validation) {

            const signature = GenerateSignature({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodType: existingVendor.foodType,
                name: existingVendor.name
            })

            return res.json(signature);
        } else {
            return res.json({ "message": "Password is not valid" })
        }
    }

    return res.json({ "message": "Login credentail not valid" })
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id);
        return res.json(existingVendor)
    }
    return res.json({ "message": "Vendor Info Not Found" })
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { foodTypes, name, address, phone } = <EditVendorInputs>req.body;

    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id);

        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes;

            const savedResult = await existingVendor.save()
            return res.json({
                success: true,
                message: "Successfully updated",
                data: savedResult
            })
        }
    }
    return res.json({ "message": "Vendor Info Not Found" })
}

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if (user) {

        const vendor = await FindVendor(user._id)

        if (vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            vendor.coverImages.push(...images);

            const savedResult = await vendor.save();

            return res.json({
                success: true,
                message: "Successfully added cover images",
                data: savedResult
            })
        }
    }
    return res.json({
        success: true,
    })
}



export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id)

        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = await existingVendor.save()
            return res.json({
                success: true,
                data: savedResult,
            })
        }
        return res.json({
            data: existingVendor,
        })
    }
    return res.json({
        success: false,
        message: "Vendor Info not found"
    })
}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const foods = await Food.find({ vendorId: user._id })
        
        if (foods !== null) {
            return res.json(foods)
        }
    }
    return res.json({
        success: false,
        message: "Something went wrong"
    })
}


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;

        const vendor = await FindVendor(user._id)

        if (vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            const createdFood = await Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                price: price,
                readyTime: readyTime,
                rating: 0
            })

            vendor.foods.push(createdFood);
            const result = await vendor.save();

            return res.status(201).json({
                success: true,
                message: "Created Food Successfully",
                data: createdFood

            })
        }
    }
    return res.json({
        success: true,
    })
}