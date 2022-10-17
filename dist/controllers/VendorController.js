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
exports.AddFood = exports.GetFoods = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const PasswordUtility_1 = require("./../utility/PasswordUtility");
const AdminController_1 = require("./AdminController");
const Food_1 = require("../models/Food");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.FindVendor)('', email);
    if (existingVendor !== null) {
        // validation and give access
        const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = (0, PasswordUtility_1.GenerateSignature)({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodType: existingVendor.foodType,
                name: existingVendor.name
            });
            return res.json(signature);
        }
        else {
            return res.json({ "message": "Password is not valid" });
        }
    }
    return res.json({ "message": "Login credentail not valid" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ "message": "Vendor Info Not Found" });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodTypes, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes;
            const savedResult = yield existingVendor.save();
            return res.json({
                success: true,
                message: "Successfully updated",
                data: savedResult
            });
        }
    }
    return res.json({ "message": "Vendor Info Not Found" });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const savedResult = yield vendor.save();
            return res.json({
                success: true,
                message: "Successfully added cover images",
                data: savedResult
            });
        }
    }
    return res.json({
        success: true,
    });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json({
                success: true,
                data: savedResult,
            });
        }
        return res.json({
            data: existingVendor,
        });
    }
    return res.json({
        success: false,
        message: "Vendor Info not found"
    });
});
exports.UpdateVendorService = UpdateVendorService;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({
        success: false,
        message: "Something went wrong"
    });
});
exports.GetFoods = GetFoods;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield Food_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                price: price,
                readyTime: readyTime,
                rating: 0
            });
            vendor.foods.push(createdFood);
            const result = yield vendor.save();
            return res.status(201).json({
                success: true,
                message: "Created Food Successfully",
                data: createdFood
            });
        }
    }
    return res.json({
        success: true,
    });
});
exports.AddFood = AddFood;
//# sourceMappingURL=VendorController.js.map