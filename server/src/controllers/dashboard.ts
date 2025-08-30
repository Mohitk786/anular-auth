import { User } from "../models/user.js";
import type { CustomRequest } from "../types/index.js";
import type { Response } from 'express';


const getAllUsers = async (req:CustomRequest, res:Response): Promise<any> => {
  try {

    const userId = req?.user?.userId

    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    if(!user?.isVerified){
        return res.status(403).json({message: 'Please verify your email to access this resource'})
    }

    const registeredToday = await User.find({
        createdAt: {
            $gte: new Date(new Date().setHours(0,0,0,0)),
            $lt: new Date(new Date().setHours(23,59,59,999))
        }
    }).select('-password -__v').lean();

    const allUser = await User.find().select('-password -__v').lean();

    return res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: {
            allUsers: allUser,
            registeredToday
        }
    })


  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
    
}

export { getAllUsers };