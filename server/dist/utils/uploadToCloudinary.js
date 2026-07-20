"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
        }, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(fileBuffer).pipe(uploadStream);
    });
};
exports.default = uploadToCloudinary;
