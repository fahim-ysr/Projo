// Mongoose model for storing verification tokens (email verification and password reset)

import mongoose from "mongoose";

// Defines the schema for email verification tokens
const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Creates the Verification model
const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
