import express from "express";

import {
 addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrders
} from '../controllers/orderController.js';
import { Admin, protect } from "../middlewares/authMiddleware.js";



const router = express.Router()


router.route('/').post(protect,addOrderItems).get(protect,Admin,getOrders)
router.route("/mine").get(protect,getMyOrders);
router.route("/:id").get(protect,getOrderById);
router.route('/:id/pay').put(protect,updateOrderToPaid)
router.route('/:id/deliver').put(protect,Admin,updateOrderToDelivered)

export default  router;

