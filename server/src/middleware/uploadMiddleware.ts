import multer from "multer";
import { ApiError } from "../utils/apiError";

// Store files in memory buffer
const storage = multer.memoryStorage();

// Accept only image/jpeg, image/png, image/webp
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        "Invalid file format. Only JPEG, PNG, and WEBP image formats are allowed."
      ) as any
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum file size limit
  },
});

export default upload;