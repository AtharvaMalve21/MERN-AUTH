import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter from "../utils/mailSender.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../utils/emailTemplates.js";
import crypto from "crypto";
dotenv.config();

export const register = async (req, res) => {
  try {
    //fetch user details
    const { name, email, password } = req.body;

    //validate the details
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (name, email, password) must be provided.",
      });
    }

    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Account has already been created using this email address.",
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create an entry in db
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    //generate a token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //save the cookie in client's browser
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    //send welcome message
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to GreatStack",
      text: `Welcome to GreatStack website. Your account has been created with email id ${email}`,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful! Welcome aboard.",
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to register at this time. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  try {
    //fetch the login details
    const { email, password } = req.body;

    //validate details
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required to login.",
      });
    }

    //check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please register first.",
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    //generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //save the cookie in client's browser
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful! Welcome back.",
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed due to server error. Please try again later.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful. See you again soon!",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({
      success: false,
      message: "Logout failed due to server error. Please try again later.",
    });
  }
};

export const sendVerifyOTP = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    //check if user account is already verified
    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Your account is already verified.",
      });
    }

    //generate otp
    const otp = crypto.randomInt(100000, 999999).toString();

    user.verificationOTP = otp;
    user.verificationOTPExpiresAt = Date.now() + 15 * 60 * 1000; //15 minutes otp is valid

    await user.save();

    //send email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE(user.email, otp),
    });

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to your registered email address.",
    });
  } catch (err) {
    console.error("Send Verify OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification OTP. Please try again later.",
    });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required to verify your account.",
      });
    }

    //validate OTP
    if (otp !== user.verificationOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP provided. Please check and try again.",
      });
    }

    //check OTP expiry
    if (user.verificationOTPExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    user.isAccountVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      data:user,
      message: "Your account has been successfully verified.",
    });
  } catch (err) {
    console.error("Verify Account Error:", err);
    return res.status(500).json({
      success: false,
      message: "Account verification failed. Please try again later.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    //provide the email
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your registered email address.",
      });
    }
    //check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    //generate otp
    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiresAt = Date.now() + 15 * 60 * 1000; //15 minutes otp is valid
    await user.save();

    //send email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE(email,otp)
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your registered email address.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset OTP. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required.",
      });
    }

    //find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with the provided email.",
      });
    }

    //validate the otp
    if (!user.resetPasswordOTP || otp !== user.resetPasswordOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing OTP. Please request a new one.",
      });
    }

    if (user.resetPasswordOTPExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new password reset OTP.",
      });
    }

    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the current password.",
      });
    }

    //hash the newpassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again later.",
    });
  }
};
