import multer from "multer";
import { ApiError } from "../utils/apiError";

const storage = multer.memoryStorage();

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    ALLOWED_IMAGE_MIME_TYPES.includes(
      file.mimetype.toLowerCase() as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
    )
  ) {
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
    fileSize: MAX_IMAGE_FILE_SIZE,
  },
});

export default upload;
