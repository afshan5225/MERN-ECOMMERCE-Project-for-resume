import express from "express";
import  {createProduct,
  createReview,
  deleteProduct,
  getAllProducts,
  getProductbyId,
  getProductsTop,
  updateProduct,
} from "../controllers/productController.js";
import { Admin, protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

// ✅ Use .get() with route method correctly
router.route('/').get(getAllProducts).post(protect,Admin,createProduct);
router.get('/top',getProductsTop)
router.route('/:id').get(getProductbyId).put(protect,Admin,updateProduct).delete(protect,Admin,deleteProduct);
router.route('/:id/reviews').post(protect,createReview)
export default router;
