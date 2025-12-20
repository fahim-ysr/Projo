import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";

// Registers a new user
const registerUser = async (req, res) => {
  try {
    // Extracts user data from request
    const { name, email, password } = req.body;
    // Checks if user already exists
    const existingUser = await User.findOne({ email });

    // Error in case user exists
    if (existingUser) {
      res.status(400).json({
        message: "Email address already in use",
      });
    }

    // Generates a salt for password hashing
    const salt = await bcrypt.genSalt(10);
    // Hashes the password using bcrypt for secured storage
    const hashPassword = await bcrypt.hash(password, salt);

    // Creates a new user in database with the hashed password
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Verification token
    const verificationToken = jwt.sign(
      { userID: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    // Sending verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}"> here </a> to verify your email</p>`;
    const emailSubject = "Verify your email";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    // Returns verification messsage
    res.status(201).json({
      message:
        "Verification email sent to your email. Please check and verify your account.",
    });

    // In case of error, logs the error and returns error messsage
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Interal server error" });
  }
};

// Logs in an existing user
const loginUser = async (req, res) => {
  try {
    // Extracts user's login credentials from request
    const { name, email, password } = req.body;

    // In case of error, logs the error and returns error messsage
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Interal server error" });
  }
};

export { registerUser, loginUser };
