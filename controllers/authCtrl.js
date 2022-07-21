const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.postSignin = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      const error = new Error("Email already exist, please pick another email !");
      res.status(409).json({
        error: "Email already exist, please pick another email !",
      });
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });
    const result = await user.save();
    res.status(200).json({
      message: "User created",
      user: { id: result._id, email: result.email },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

let loadedUser;
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      const error = new Error("User with this email not found !");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) {
      const error = new Error("Password is not match !");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ email: loadedUser.email }, "GZE2I7HNJ9HEF8M?JEZ5!", {
      expire: "20m", // it will expire token after 20 minutes and if the user then refresh the page will log out
    });
    res.status(200).json({ token: token });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUser = (req, res, next) => {
  // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  res.status(200).json({
    user: {
      id: loadedUser._id,
      fullname: loadedUser.fullname,
      email: loadedUser.email,
    },
  });
};
