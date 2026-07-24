"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRestaurant = exports.updateRestaurantImage = exports.updateRestaurant = exports.getRestaurantById = exports.getRestaurantsByCategory = exports.searchRestaurants = exports.getAllRestaurants = exports.createRestaurant = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const restaurant_1 = __importDefault(require("../models/restaurant"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const restaurantService_1 = require("../services/restaurantService");
// Create restaurant
exports.createRestaurant = (0, asyncHandler_1.default)(async (req, res) => {
    let imageUrl = "";
    let imagePublicId = "";
    // Upload image to Cloudinary
    if (req.file) {
        const uploadRes = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "restaurants");
        imageUrl = uploadRes.secure_url;
        imagePublicId = uploadRes.public_id;
    }
    else if (req.body.image) {
        imageUrl = req.body.image;
    }
    const restaurant = await (0, restaurantService_1.createRestaurantService)({
        name: req.body.name,
        description: req.body.description || req.body.name,
        address: req.body.address,
        category: req.body.category || "General",
        deliveryTime: req.body.deliveryTime ? Number(req.body.deliveryTime) : 30,
        deliveryFee: req.body.deliveryFee ? Number(req.body.deliveryFee) : 0,
        image: imageUrl,
        imagePublicId,
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
    const existing = await restaurant_1.default.findById(id);
    const updateData = { ...req.body };
    // Upload new image if present
    if (req.file) {
        if (existing?.imagePublicId) {
            await (0, uploadToCloudinary_1.deleteFromCloudinary)(existing.imagePublicId);
        }
        const uploadRes = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "restaurants");
        updateData.image = uploadRes.secure_url;
        updateData.imagePublicId = uploadRes.public_id;
    }
    const restaurant = await (0, restaurantService_1.updateRestaurantService)(id, updateData);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant updated successfully", restaurant));
});
// Update restaurant image
exports.updateRestaurantImage = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const existing = await restaurant_1.default.findById(id);
    let imageUrl = existing?.image || "";
    let imagePublicId = existing?.imagePublicId || "";
    if (req.file) {
        if (existing?.imagePublicId) {
            await (0, uploadToCloudinary_1.deleteFromCloudinary)(existing.imagePublicId);
        }
        const uploadRes = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "restaurants");
        imageUrl = uploadRes.secure_url;
        imagePublicId = uploadRes.public_id;
    }
    const restaurant = await (0, restaurantService_1.updateRestaurantService)(id, {
        image: imageUrl,
        imagePublicId,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant image updated successfully", restaurant));
});
// Delete restaurant
exports.deleteRestaurant = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await (0, restaurantService_1.deleteRestaurantService)(id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Restaurant deleted successfully"));
});
