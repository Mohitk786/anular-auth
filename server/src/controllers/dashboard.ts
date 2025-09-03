import { User } from '../models/user.js';
import type { CustomRequest } from '../types/index.js';
import type { Response } from 'express';

const getAllUsers = async (req: CustomRequest, res: Response): Promise<any> => {
  try {

    const registeredToday = await User.find({
      isDeleted: false,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    })
      .select('-password -__v')
      .lean();

    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 4);

    const lastFiveDays = await User.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: fiveDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const countsMap = Object.fromEntries(lastFiveDays.map((item) => [item._id, item.count]));

    const dates = [];
    const counts = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dates.push(dateStr);
      counts.push(countsMap[dateStr as string] || 0);
    }

    const allUser = await User.find({
      isDeleted: false,
    }).select('-password -__v').lean();

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        allUsers: allUser,
        registeredToday,
        dates,
        counts,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

const removeUser = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isDeleted) {
      await User.findByIdAndUpdate(id, { isDeleted: false });
      return res.status(200).json({
        success: true,
        message: 'User Restored successfully',
      });
    } else {
      await User.findByIdAndUpdate(id, { isDeleted: true });
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

const getDeletedUsers = async (_: unknown, res: Response): Promise<any> => {
  try {
    const users = await User.find({ isDeleted: true }).select('-password -__v').lean();
    return res.status(200).json({
      success: true,
      message: 'Deleted users fetched successfully',
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch deleted users',
    });
  }
};


const deleteUser = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const userId = req?.user?.userId;
    const { id } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } 
    
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'User Permanently deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

export { getAllUsers, removeUser, getDeletedUsers, deleteUser };
