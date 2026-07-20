"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRestaurant = exports.updateRestaurantImage = exports.updateRestaurant = exports.getRestaurantById = exports.getRestaurantsByCategory = exports.searchRestaurants = exports.getAllRestaurants = exports.createRestaurant = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const uploadToCloudinary_1 = __importDefault(require("../utils/uploadToCloudinary"));
const restaurantService_1 = require("../services/restaurantService");
// Create restaurant
exports.createRestaurant = (0, asyncHandler_1.default)(async (req, res) => {
    let imageUrl = "";
    // Upload image to Cloudinary
    if (req.file) {
        imageUrl = await (0, uploadToCloudinary_1.default)(req.file.buffer, "restaurants");
    }
    const restaurant = await (0, restaurantService_1.createRestaurantService)({
        ...req.body,
        image: imageUrl,
        owner: req.user.id,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Restaurant created successfully", restaurant));
});
// Get all restaurants
exports.getAllRestaurants = (0, asyncHandler_1.default)(async (_req, res) => {
    const restaurants = await (0, restaurantService_1.getAllRestaurantsService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurants fetched successfully", restaurants));
});
// Search restaurants by name
exports.searchRestaurants = (0, asyncHandler_1.default)(async (req, res) => {
    const { name = "" } = req.query;
    const restaurants = await (0, restaurantService_1.searchRestaurantsService)(name);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurants fetched successfully", restaurants));
});
// Get restaurants by category
exports.getRestaurantsByCategory = (0, asyncHandler_1.default)(async (req, res) => {
    const { category } = req.params;
    const restaurants = await (0, restaurantService_1.getRestaurantsByCategoryService)(category);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurants fetched successfully", restaurants));
});
// Get restaurant by ID
exports.getRestaurantById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const restaurant = await (0, restaurantService_1.getRestaurantByIdService)(id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant fetched successfully", restaurant));
});
// Update restaurant
exports.updateRestaurant = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const restaurant = await (0, restaurantService_1.updateRestaurantService)(id, req.body);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant updated successfully", restaurant));
});
// Update restaurant image
exports.updateRestaurantImage = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    let imageUrl = "";
    if (req.file) {
        imageUrl = await (0, uploadToCloudinary_1.default)(req.file.buffer, "restaurants");
    }
    const restaurant = await (0, restaurantService_1.updateRestaurantService)(id, {
        image: imageUrl,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant image updated successfully", restaurant));
});
// Delete restaurant
exports.deleteRestaurant = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await (0, restaurantService_1.deleteRestaurantService)(id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant deleted successfully"));
});
