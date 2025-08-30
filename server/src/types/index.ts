
import type { Request } from "express";

export interface User {
       userId: string;
       email: string;
       isVerified: boolean;
}

export interface CustomRequest extends Request {
  user?: User
}