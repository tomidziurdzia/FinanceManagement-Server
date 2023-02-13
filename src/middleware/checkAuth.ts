import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../interfaces/user.interface";
import User from "../models/User";

const checkAuth = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      //   req.user = await User.findById(decoded.id).select(
      //     "-password -token -confirmed -createdAt -updatedAt"
      //   );
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      const decodedId = Object.values(decoded)[0];

      const checkUser = await User.findById(decodedId).select(
        "-password -token -confirmed -createdAt -updatedAt"
      );

      req.user = checkUser;
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "There was an error" });
    }
  }

  if (!token) {
    const error = new Error("Invalid token");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default checkAuth;
