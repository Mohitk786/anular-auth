import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { registerSchema } from "../lib/validation/auth.js";
import {z} from 'zod'

const saltRounds= 10


type User = z.infer<typeof registerSchema> & {isVerfied:boolean}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "name must be at least 3 characters"],
      maxlength: [30, "name cannot exceed 30 characters"],
     
    },
  
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: null,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
    },
    phone: {
        type: String,
        required:[true, 'Phone is required']

    },
    isVerfied: {
        type:Boolean,
        default:false
    }
},
   
  {
    timestamps: true,
  }
);




userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password as string, salt);

    next();
  } catch (error) {
    next(error as Error);
  }
});




export const User = model<User>("User", userSchema);
