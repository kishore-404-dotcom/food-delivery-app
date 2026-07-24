import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

import cloudinary from "../config/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export type CloudinaryImageFolder = "restaurants" | "foods" | "users";

// Upload image stream to Cloudinary with folder hierarchy & auto-optimization
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  subFolder: CloudinaryImageFolder = "foods"
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

// Deletion is only attempted with a stored Cloudinary public_id. Callers use this
// after a successful replacement/database update so the existing image is preserved
// if the new upload fails.
export const deleteFromCloudinary = async (publicId?: string): Promise<void> => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary (${publicId}):`, error);
  }
};

export default uploadToCloudinary;
