const userModel = require("../models/user.mode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async ({ username, email, fullName, password, role = "user" }) => {
  try {
    const isUserAlreadyExists = await userModel.findOne({
      $or: [
        { username }, { email }
      ]
    });

    if (isUserAlreadyExists) {
      const err = new Error("User already exists.");
      err.statusCode = 409;
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      password: hash,
      role,
    });

    const token = jwt.sign({
      id: user._id,
    }, process.env.JWT_SECRET);

    return { user, token };

  } catch (error) {
    throw error;
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, fullName, username, password } = req.body;

    if (!email || !username || !password || !fullName || !fullName.firstName || !fullName.lastName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const { user, token } = await createUser({
      email,
      fullName,
      username,
      password,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3600000, // 1 hour
    });
    
    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong.";
    res.status(statusCode).json({ message });
  }
};

const loginUser = async(req, res)=>{
  const {email, username, password} = req.body;

  const user = await userModel.findOne({
    $or:[
      {username}, {email}
    ]
  }).select("+password");


  if(!user){
    return res.status(400).json({
      message:"Invalid Username or email"
    })
  };


  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid){
    return res.status(400).json({
      message:"invalid password"
    })
  };

const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message:"User Logged in Successfully",
    user:{
      id: user._id,
      username: user.username,
      email: user.email,
      fullName:user.fullName,
      role: user.role
    }
  })
}

module.exports = {
  registerUser,
  loginUser
};