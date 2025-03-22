import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from '@sendgrid/mail';
import { sendVerificationCode, verifyCode } from '../utils/twilioUtils.js';

import userModel from "../models/userModels.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from "../config/emailTemplates.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const register = async (req, res) => {
  const { name, email, password, mobileNumber } = req.body;

  if (!name || !email || !password || !mobileNumber) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      mobileNumber
    });

    // Send welcome email
    const welcomeMsg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to MedGenix',
      html: WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{email}}', email)
        .replace('{{password}}', password)
        .replace('{{welcome_link}}', `${process.env.FRONTEND_URL}/verify-email`)
    };
    await sgMail.send(welcomeMsg);

    // Send mobile verification code using Twilio Verify
    const verificationResult = await sendVerificationCode(mobileNumber);
    if (!verificationResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send verification code",
        error: verificationResult.error 
      });
    }

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully. Please verify your mobile number.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAccountVerified: newUser.isAccountVerified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.json({
      success: true,
      message: "Login success",
      user: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// send verification OTP to the user's email address
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await userModel.findById(userID);

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Verify Your MedGenix Account",
      html: EMAIL_VERIFY_TEMPLATE
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
    };
    
    await sgMail.send(mailOption);
    return res.json({
      success: true,
      message: "Verification OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userID, otp } = req.body;

  if (!userID || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// check if the user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// send  password reset OTP
export const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Password Reset Request',
      text: `Your password reset code is ${otp}`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    };
    await sgMail.send(msg);

    res.status(200).json({ success: true, message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// reset user password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyMobileOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: "Mobile number and OTP are required" 
    });
  }

  try {
    const user = await userModel.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify the code using Twilio Verify
    const verificationResult = await verifyCode(mobileNumber, otp);
    
    if (!verificationResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: "Verification failed",
        error: verificationResult.error 
      });
    }

    if (verificationResult.status === 'approved') {
      user.isAccountVerified = true;
      await user.save();
      return res.status(200).json({ 
        success: true, 
        message: "Mobile number verified successfully" 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid verification code" 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};
