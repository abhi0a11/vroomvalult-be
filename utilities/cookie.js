import jwt from "jsonwebtoken";

export const sendCookie = async (user, res, message, statusCode) => {
  try {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res
      .status(statusCode)
      .cookie("token", token, {
        httpOnly: true,
        path: "/",
        domain:
          process.env.NODE_ENV === "Development"
            ? "localhost"
            : new URL(process.env.Server).hostname,
        samesite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
        maxAge: 15 * 60 * 1000,
      })
      .json({
        success: true,
        message: message,
      });
  } catch (error) {
    console.log("errro in cookie");
  }
};
