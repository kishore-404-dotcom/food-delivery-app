import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

import cloudinary from "../config/cloudinary";

// Upload image to Cloudinary
const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<string> => {

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
      },

      (
        error,
        result?: UploadApiResponse
      ) => {

        if (error || !result) {
          return reject(error);
        }

        resolve(result.secure_url);

      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);

  });

};

export default uploadToCloudinary;