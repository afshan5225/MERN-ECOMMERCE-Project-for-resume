import express from "express";

import {
  authUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserbyId,
  updateUser
} from '../controllers/userController.js';
import { Admin, protect } from "../middlewares/authMiddleware.js";



const router = express.Router()


router.route('/').post(registerUser).get(protect,Admin,getUsers);
router.post('/logout',logoutUser)
router.post('/login',authUser);
router.route("/profile").get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/:id').delete(protect,Admin,deleteUser).get(protect,Admin,getUserbyId).put(protect,Admin,updateUser)

export default router;