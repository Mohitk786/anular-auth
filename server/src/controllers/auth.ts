import type { Request, Response } from 'express';
import { registerSchema, loginSchema, resetPasswordSchema } from '../lib/validation/auth.js';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import { Otp } from '../models/otp.js';
import { sendMail } from '../lib/nodemailer.js';
import jwt from 'jsonwebtoken';
import { config } from '../constants/index.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone already Exist, please Login',
      });
    }

    const user = await User.create({
      email,
      phone,
      name,
      password,
    });

    const otpVal = generateOTP();

    await Otp.create({
      userId: user?._id,
      email: user?.email,
      otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      value: otpVal,
    });

    await sendMail(email, 'Verify Your Email', otpVal);

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

const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Email is not registerd, try signing up again`,
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: `This account is already verified, please login`,
      });
    }

    const existingOTP = await Otp.findOne({
      email,
    });

    if (existingOTP?.createdAt) {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

      if (existingOTP.createdAt > twoMinutesAgo) {
        return res.status(400).json({
          success: false,
          message: `try again after ${Math.ceil(
            (existingOTP.createdAt.getTime() - twoMinutesAgo.getTime()) / 1000
          )} seconds`,
        });
      }
    }

    if (existingOTP) {
      await Otp.findOneAndDelete({ email });
    }

    const otpVal = generateOTP();

    await Otp.create({
      userId: user?.id,
      email: user?.email,
      otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      value: otpVal,
    });

    await sendMail(email, 'Verify Your Email', otpVal);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: `Failed to resend OTP ${err?.message}`,
    });
  }
};

const verify = async (req: Request, res: Response) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        success: false,
        message: 'Email and Otp are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User Not Found with this email, signup again',
      });
    }

    if (user?.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified, please login',
      });
    }

    const existOtp = await Otp.findOne({ email });

    if (!existOtp) {
      return res.status(400).json({
        success: false,
        message: 'Otp Not Found signup again',
      });
    }
    const isOtpExpired = otp.otpExpiresAt < new Date();

    if (isOtpExpired) {
      return res.status(400).json({
        success: false,
        message: 'Otp is Expired',
      });
    }

    if (otp != existOtp?.value) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    //Otp no longer need
    await Otp.findByIdAndDelete(existOtp._id);

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to Verify otp',
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result?.error,
      });
    }

    const { email, password } = result.data;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: `Email does not Exist. Please Signup !`,
      });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Verify Your email address first',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = await jwt.sign(
      {
        userId: existingUser?._id,
        email,
        isVerified: true,
      },
      process.env.JWT_SECRET as string
    );

    res.cookie(config.COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        ...existingUser.toObject(),
        password: undefined,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: `Something went Wrong ${err?.message}`,
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please Enter a valid Email address',
      });
    }

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res.status(400).json({
        success: false,
        message: 'Email not found',
      });
    }

    const existingToken = await Otp.findOne({
      userId: isUserExist?._id,
    });

    if (
      existingToken &&
      existingToken.resetTokenExpiresAt &&
      existingToken.resetTokenExpiresAt > new Date()
    ) {
      const minutesLeft = Math.ceil(
        (existingToken.resetTokenExpiresAt.getTime() - Date.now()) / (60 * 1000)
      );
      return res.status(400).json({
        success: false,
        message: `Reset Link is already sent, try after ${minutesLeft} minute(s)`,
      });
    }

    //removing the existing expired reset token for current user
    if (
      existingToken &&
      existingToken.resetTokenExpiresAt &&
      existingToken.resetTokenExpiresAt < new Date()
    ) {
      await Otp.findByIdAndDelete(existingToken?._id);
    }

    const resetToken = await jwt.sign(
      {
        email,
        userId: isUserExist?.id,
      },
      process.env.JWT_SECRET as string
    );

    await Otp.create({
      email,
      userId: isUserExist?._id,
      resetToken,
      resetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetLink = process.env.DOMAIN_URL + `/reset-password/?token=${resetToken}`;

    await sendMail(email, 'Reset the Password', resetLink);

    return res.status(200).json({
      success: true,
      message: 'Password Reset link send to your registerd Email. Valid for 15 mins',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: 'Something is Wrong ' + err?.message,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = resetPasswordSchema.safeParse(req.body);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result?.error,
      });
    }

    const { resetToken, newPassword, confirmNewPassword } = result?.data;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'password do not match',
      });
    }
    const decoded = await jwt.verify(resetToken, process.env.JWT_SECRET as string);

    if (typeof decoded === 'string') return;

    const token = await Otp.findOne({ userId: decoded?.userId });

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (token?.resetTokenExpiresAt! < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Token Expired, Get yourself a new Email',
      });
    }

    const user = await User.findById(decoded?.userId);
    if (user) {
      user.password = newPassword;
      await user.save();
    }
    await Otp.findByIdAndDelete(token?._id);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to Reset the Password ' + err?.message,
    });
  }
};

export { signUp, login, verify, forgotPassword, resetPassword, resendOtp };
