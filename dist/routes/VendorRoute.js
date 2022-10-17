"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const VendorController_1 = require("./../controllers/VendorController");
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post('/login', VendorController_1.VendorLogin);
router.use(middleware_1.Authenticate);
router.get('/profile', VendorController_1.GetVendorProfile);
router.patch('/profile', VendorController_1.UpdateVendorProfile);
router.patch('/service', VendorController_1.UpdateVendorService);
router.patch('/coverimage', images, VendorController_1.UpdateVendorCoverImage);
router.post('/food', images, VendorController_1.AddFood);
router.get('/food', VendorController_1.GetFoods);
//# sourceMappingURL=VendorRoute.js.map