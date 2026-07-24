import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

import cloudinary from "../config/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

// Upload image stream to Cloudinary with folder hierarchy & auto-optimization
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  subFolder: "restaurants" | "foods" | "users" = "foods"
): Promise<CloudinaryUploadResult> => {
  const folder = `food-delivery/${subFolder}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload image to Cloudinary"));
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

// Delete image from Cloudinary by public_id
export const deleteFromCloudinary = async (publicId?: string): Promise<void> => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary (${publicId}):`, error);
  }
};

export default uploadToCloudinary;