import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utilities/cookie.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone_number, my_cars } = req.body;

    let user = await User.findOne({ $or: [{ email }, { phone_number }] });
    console.log(user);
    if (user) {
      if (user.email === email && user.phone_number === phone_number) {
        return res.status(404).json({
          status: false,
          messge: `Email: ${email} or Phone Number: ${phone_number} already exist. Please log in to continue.`,
        });
      } else if (user.email === email) {
        return res.status(404).json({
          status: false,
          messge: `Email: ${email} already exist. Please log in to continue.`,
        });
      } else if (user.phone_number === phone_number) {
        return res.status(404).json({
          status: false,
          messge: `Phone Number: ${phone_number} already exist. Please log in to continue.`,
        });
      }
    }

    const hashed_password = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashed_password,
      phone_number,
      my_cars,
    });
    sendCookie(user, res, "Successfully registed", 201);
  } catch (error) {
    console.log(`Error while registering user`, error);
    res
      .status(500)
      .send("Error while registering User please try again later!");
  }
};
export const loginUserViaEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        status: false,
        messge: `User not found. Please sing up to continue!`,
      });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Password not matched",
      });
    }

    sendCookie(user, res, `Welcome back ${user.name}`, 200);
  } catch (error) {
    console.log(`Error while logging user`, error);
    res.status(500).send("Error while logging in. Please try again later!");
  }
};
export const loginUserViaPhone = async (req, res) => {
  try {
    const { phone_number } = req.body;

    let user = await User.findOne({ phone_number });
    if (!user) {
      return res.status(404).json({
        status: false,
        messge: `User not found. Please sing up to continue!`,
      });
    }

    sendCookie(user, res, `Welcome back ${user.name}`, 200);
  } catch (error) {
    console.log(`Error while logging user`, error);
    res.status(500).send("Error while logging in. Please try again later!");
  }
};

export const getAuthStatus = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication failed.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("error");
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Please log in.",
      });
    }
    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        path: "/",
        domain:
          process.env.NODE_ENV === "Development"
            ? "localhost"
            : new URL(process.env.Server).hostname,
        samesite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    next(error);
  }
};
