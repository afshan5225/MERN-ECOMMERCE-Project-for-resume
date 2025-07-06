import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import userModel from "../models/userModel.js"
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";


export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id); // 🛠 you pass `res`, not `req`

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


    



export const logoutUser = asyncHandler(async(req,res)=> {

    res.cookie('jwt',"",{
    httpOnly:true,
    expires: new Date(0)

    })

    res.status(200).json({message:"logged out successfully!"})

})
export const registerUser = asyncHandler(async(req,res)=>{
    const{name,email,password,} = req.body;
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(401);
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){

        generateToken(res, user._id)
      
        res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    }
})


export const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    
    if(user){
        
        res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    }else{
        res.status(404);
        throw new Error('User not Found!')
    }

})


export const updateUserProfile = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id);

   if(user){
    user.name = req.body.name || user.name,
    user.email = req.body.email|| user.email
   }


   if(req.body.email){
    user.password = req.body.password || user.password
   }

   const updatedUser = await user.save();
   res.status(200).json({
    _id:updatedUser._id,
    name:updatedUser.name,
    email:updatedUser.email,
    isAdmin:updatedUser.isAdmin,
   })
})

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password'); // exclude password
  res.json(users);
});



export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.equals(req.params.id)) {
    res.status(400);
    throw new Error("You cannot delete yourself");
  }

  const result = await User.deleteOne({ _id: req.params.id });

  if (result.deletedCount > 0) {
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserbyId = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
