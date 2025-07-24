import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    // ✅ New fields
    passwordHistory: [
      {
        password: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
      },
    ],

    passwordChangedAt: {
      type: Date,
    },

    passwordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
