import type { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../lib/validation/auth.js';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import { Otp } from '../models/otp.js';
import { sendMail } from '../lib/nodemailer.js';
import jwt from 'jsonwebtoken'


const signUp = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);


    
    if (result?.error) {
      return res.status(400).json({
        success: false,
        message: `Somethign went wrong ${result?.error}`,
      });
    }
    

    const { email, phone, name, password } = await result.data!;

    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone }
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already Exist, please Login',
      });
    }

    const user = await User.create({
      email,
      phone,
      name,
      password,
    });

    const otpVal = Math.floor(100000 + Math.random() * 900000).toString();

   await Otp.create({
        userId:user?.id,
        email: user?.email,
        expiresAt: new Date(Date.now() + 15*60*1000),
        value:otpVal 
    })


    await sendMail(email, "Verify Your Email", otpVal)


    return res.status(200).json({
      success: true,
      message: `Registered Successfully`,
      data: user,
    });

  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: `Something went Wrong ${err?.message}`,
    });
  }
};

const verify = async (req:Request, res:Response)=>{
  try{
    const {otp, email} = req.body;

    if(!otp || !email){
      return res.status(400).json({
        success: false,
        message:"Email and Otp are required",
      });
    }

    const existOtp = await Otp.findOne({email})

    if(!existOtp){
      return res.status(400).json({
        success: false,
        message: "Otp Not Found signup again",
      });
    }
    const isOtpExpired = otp.expiresAt < new Date();

    if(isOtpExpired){
       return res.status(400).json({
        success: false,
        message: "Otp is Expired",
      });
    }

    if(existOtp.isUsed){
       return res.status(400).json({
      success: false,
      message: "Otp already used",
      });
    }

    existOtp.isUsed = true;
    await existOtp.save();

    const user = await User.findOne({ email });
    if (user) {
      user.isVerfied = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  }catch(err){
    return res.status(400).json({
        success: false,
        message: 'Failed to Verify otp',
      });
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result?.error,
      });
    }

    const { email, password } =  result.data;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: `Email does not Exist. Please Signup !`,
    });
  }

  if(!existingUser.isVerfied){
    return res.status(400).json({
      success: false,
      message: "Verify Your email address first",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password)
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }

  const token = jwt.sign({
    userId:existingUser?._id,
    email
  }, process.env.JWT_SECRET as string)

  res.cookie("anuglar_auth_token", token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === "production"
  })

  res.status(200).json({
    status: true,
    message: "Login successful",
  });



  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: `Something went Wrong ${err?.message}`,
    });
  }
};

export  {
    signUp,
    login,
    verify
}
