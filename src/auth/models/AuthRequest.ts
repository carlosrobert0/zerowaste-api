import { Request } from "express";
import { Users } from "src/users/entities/users.entity";

export interface AuthRequest extends Request {
  user: Users
}