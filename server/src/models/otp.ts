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
    otpExpiresAt: {
      type: Date,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    value: {
        type: String,
        default:null
    },
    resetToken: {
      type:String,
      default:null
    },
    resetTokenExpiresAt:{
      type:Date
    }
  },
  {
    timestamps: true,
  }
);

export const Otp = model("Otp", otpSchema);
