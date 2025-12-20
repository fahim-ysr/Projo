// User Schema (Defines the structure and validation rules for user documents in MongoDB)

import mongoose, { Schema } from "mongoose";

// Defines the schema for user documents
const userSchema = new Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // User's password (Hashed)
    password: {
      type: String,
      required: true,
      select: false,
    },

    // URL or path to user's profile pic
    profilePicture: {
      type: String,
    },

    // Flag indicating if user has verified their email address
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Timestamp of user's last login
    lastLogin: {
      type: Date,
    },

    // Flag indicating if 2FA is enabled
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },

    // OTP for 2FA
    otp2FA: {
      type: String,
      select: false,
    },

    // Expiration timestamp for the 2FA OTP
    otp2FAExpires: {
      type: Date,
      select: false,
    },
  },

  // Adds createdAt and updatedAt timestamps automatically
  { timestamps: true }
);

// Creates and exports the User model based on this schema
const User = mongoose.model("User", userSchema);

export default User;
