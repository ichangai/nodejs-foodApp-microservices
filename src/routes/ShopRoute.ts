import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
import { GetFoodAvailability, GetTopRestaurants, GetFoodsIn30Min, SearchFoods, GetRestaurantById } from '../controllers';

/*================================== Food Availability ========================================*/

router.get('/:pincode', GetFoodAvailability);
/*=====================================Top Restaurants =======================================*/

router.get('/top-restaurants/:pincode', GetTopRestaurants)
/*=====================================Food available in 30mins =======================================*/

router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min)
/*=====================================Search Foods =======================================*/

router.get('/search-foods/:pincode', SearchFoods)

/*===================================== FInd Restaurants By Id =======================================*/
router.get('/restaurant/:id', GetRestaurantById)

export { router as ShopRoute };