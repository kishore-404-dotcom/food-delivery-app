"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Upload image stream to Cloudinary with folder hierarchy & auto-optimization
const uploadToCloudinary = (fileBuffer, subFolder = "foods") => {
    const folder = `food-delivery/${subFolder}`;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
            quality: "auto",
            fetch_format: "auto",
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error("Failed to upload image to Cloudinary"));
            }
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
            });
        });
        stream_1.Readable.from(fileBuffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
// Deletion is only attempted with a stored Cloudinary public_id. Callers use this
// after a successful replacement/database update so the existing image is preserved
// if the new upload fails.
const deleteFromCloudinary = async (publicId) => {
    if (!publicId)
        return;
    try {
        await cloudinary_1.default.uploader.destroy(publicId);
    }
    catch (error) {
        console.error(`Failed to delete image from Cloudinary (${publicId}):`, error);
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = exports.uploadToCloudinary;
