import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../db/users-utils.js";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  // Bearer token is a piece of data that acts as a permit to operate on resources, passed in the Authorization header of requests

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
