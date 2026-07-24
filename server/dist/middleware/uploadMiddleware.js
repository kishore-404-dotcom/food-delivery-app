"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const apiError_1 = require("../utils/apiError");
// Store files in memory buffer
const storage = multer_1.default.memoryStorage();
// Accept only image/jpeg, image/png, image/webp
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const fileFilter = (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
    }
    else {
        cb(new apiError_1.ApiError(400, "Invalid file format. Only JPEG, PNG, and WEBP image formats are allowed."));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB maximum file size limit
    },
});
exports.default = upload;
