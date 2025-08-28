import { Schema, model } from "mongoose";

const otpSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: [true, "OTP expiration is required"],
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    value: {
        type: String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

export const Otp = model("Otp", otpSchema);
