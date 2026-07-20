"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFood = exports.updateFoodImage = exports.updateFood = exports.getFood = exports.getFoodsByCategory = exports.searchFoods = exports.getFoods = exports.createFood = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const uploadToCloudinary_1 = __importDefault(require("../utils/uploadToCloudinary"));
const foodService_1 = require("../services/foodService");
// Create food
exports.createFood = (0, asyncHandler_1.default)(async (req, res) => {
    let imageUrl = "";
    // Upload image to Cloudinary
    if (req.file) {
        imageUrl = await (0, uploadToCloudinary_1.default)(req.file.buffer, "foods");
    }
    const food = await (0, foodService_1.createFoodService)({
        ...req.body,
        image: imageUrl,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Food created successfully", food));
});
// Get all foods
exports.getFoods = (0, asyncHandler_1.default)(async (_req, res) => {
    const foods = await (0, foodService_1.getFoodsService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Foods fetched successfully", foods));
});
// Search foods
exports.searchFoods = (0, asyncHandler_1.default)(async (req, res) => {
    const { name = "" } = req.query;
    const foods = await (0, foodService_1.searchFoodsService)(name);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Foods fetched successfully", foods));
});
// Get foods by category
exports.getFoodsByCategory = (0, asyncHandler_1.default)(async (req, res) => {
    const { category } = req.params;
    const foods = await (0, foodService_1.getFoodsByCategoryService)(category);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Foods fetched successfully", foods));
});
// Get food by ID
exports.getFood = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const food = await (0, foodService_1.getFoodByIdService)(id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Food fetched successfully", food));
});
// Update food
exports.updateFood = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const food = await (0, foodService_1.updateFoodService)(id, req.body);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Food updated successfully", food));
});
// Update food image
exports.updateFoodImage = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    let imageUrl = "";
    if (req.file) {
        imageUrl = await (0, uploadToCloudinary_1.default)(req.file.buffer, "foods");
    }
    const food = await (0, foodService_1.updateFoodService)(id, {
        image: imageUrl,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Food image updated successfully", food));
});
// Delete food
exports.deleteFood = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await (0, foodService_1.deleteFoodService)(id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Food deleted successfully"));
});
