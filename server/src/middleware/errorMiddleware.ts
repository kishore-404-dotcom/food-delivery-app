import { Request, Response, NextFunction } from "express";
import multer from "multer";
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

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image exceeds the maximum file size of 5 MB."
        : `Image upload failed: ${err.message}`;

    return res.status(400).json({
      success: false,
      message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

};

export default errorMiddleware;
