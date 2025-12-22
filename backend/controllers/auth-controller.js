import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

// Registers a new user
const registerUser = async (req, res) => {
  try {
    // Extracts user data from request
    const { name, email, password } = req.body;

    // From Arcjet Docs (To check if email is valid & not disposable email address)
    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email address" }));
    }

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
      { userId: newUser._id, purpose: "email-verification" },
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
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
      });

      if (existingVerification && existingVerification.expiresAt > new Date()) {
        return res.status(400).json({
          message:
            "Email not verified. Please check your email for the verification link.",
        });
      } else {
        // Deletes the previous verification link
        await Verification.findByIdAndDelete(existingVerification._id);

        // Gets a new token
        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Issues a new verification link
        await Verification.findBy({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 1 * 60 * 50 * 1000),
        });

        // Sending verification email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `<p>Click <a href="${verificationLink}"> here </a> to verify your email</p>`;
        const emailSubject = "Verify your email";

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
          res
            .status(500)
            .json({ message: "Failed to send verification email" });
        }

        res.status(201).json({
          message:
            "Verification email sent to your email. Please check and verify your account.",
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login Successful",
      token,
      user: userData,
    });

    // In case of error, logs the error and returns error messsage
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Interal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    return res.status(200).json({ message: "Email verified successfully" });

    // In case of error, logs the error and returns error messsage
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Interal server error" });
  }
};

export { registerUser, loginUser, verifyEmail };
