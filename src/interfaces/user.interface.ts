import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserProps {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  token: string;
  confirmed: boolean;
  googleAcctount: boolean;
  picture: string;
  checkPassword(password: string): boolean;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload | { _id: string; token: string };
  id?: string;
}
