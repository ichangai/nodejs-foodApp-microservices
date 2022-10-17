"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoute = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.ShopRoute = router;
const controllers_1 = require("../controllers");
/*================================== Food Availability ========================================*/
router.get('/:pincode', controllers_1.GetFoodAvailability);
/*=====================================Top Restaurants =======================================*/
router.get('/top-restaurants/:pincode', controllers_1.GetTopRestaurants);
/*=====================================Food available in 30mins =======================================*/
router.get('/foods-in-30-min/:pincode', controllers_1.GetFoodsIn30Min);
/*=====================================Search Foods =======================================*/
router.get('/search-foods/:pincode', controllers_1.SearchFoods);
/*===================================== FInd Restaurants By Id =======================================*/
router.get('/restaurant/:id', controllers_1.GetRestaurantById);
//# sourceMappingURL=ShopRoute.js.map