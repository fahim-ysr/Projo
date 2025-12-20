import User from "../models/user.js";
import bcrypt from "bcrypt";

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

    // Returbs verification messsage
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
