import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
    
// Global error handler
const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof ApiError) {

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

};

export default errorMiddleware;