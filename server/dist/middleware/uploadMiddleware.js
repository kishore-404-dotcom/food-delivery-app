"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_IMAGE_FILE_SIZE = exports.ALLOWED_IMAGE_MIME_TYPES = void 0;
const multer_1 = __importDefault(require("multer"));
const apiError_1 = require("../utils/apiError");
const storage = multer_1.default.memoryStorage();
exports.ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];
exports.MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const fileFilter = (_req, file, cb) => {
    if (exports.ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
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
        fileSize: exports.MAX_IMAGE_FILE_SIZE,
    },
});
exports.default = upload;
