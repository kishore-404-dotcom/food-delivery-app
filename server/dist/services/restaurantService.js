"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantsByCategoryService = exports.searchRestaurantsService = exports.deleteRestaurantService = exports.updateRestaurantService = exports.getRestaurantByIdService = exports.getAllRestaurantsService = exports.createRestaurantService = void 0;
const restaurant_1 = __importDefault(require("../models/restaurant"));
const apiError_1 = require("../utils/apiError");
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const cacheService_1 = require("./cacheService");
// Create restaurant
const createRestaurantService = async (restaurantData) => {
    return await restaurant_1.default.create(restaurantData);
};
exports.createRestaurantService = createRestaurantService;
// Get all restaurants
const getAllRestaurantsService = async () => {
    const cached = await (0, cacheService_1.getCache)("restaurants");
    if (cached) {
        return JSON.parse(cached);
    }
    const restaurants = await restaurant_1.default.find()
        .populate("owner", "name email")
        .sort({
        createdAt: -1,
    });
    await (0, cacheService_1.setCache)("restaurants", restaurants);
    return restaurants;
};
exports.getAllRestaurantsService = getAllRestaurantsService;
// Get restaurant by ID
const getRestaurantByIdService = async (id) => {
    const restaurant = await restaurant_1.default.findById(id).populate("owner", "name email");
    if (!restaurant) {
        throw new apiError_1.ApiError(404, "Restaurant not found");
    }
    return restaurant;
};
exports.getRestaurantByIdService = getRestaurantByIdService;
// Update restaurant
const updateRestaurantService = async (id, data) => {
    const restaurant = await restaurant_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!restaurant) {
        throw new apiError_1.ApiError(404, "Restaurant not found");
    }
    return restaurant;
};
exports.updateRestaurantService = updateRestaurantService;
// Delete restaurant
const deleteRestaurantService = async (id) => {
    const restaurant = await restaurant_1.default.findById(id);
    if (!restaurant) {
        throw new apiError_1.ApiError(404, "Restaurant not found");
    }
    if (restaurant.imagePublicId) {
        await (0, uploadToCloudinary_1.deleteFromCloudinary)(restaurant.imagePublicId);
    }
    await restaurant.deleteOne();
};
exports.deleteRestaurantService = deleteRestaurantService;
// Search restaurants
const searchRestaurantsService = async (name) => {
    return await restaurant_1.default.find({
        name: {
            $regex: name,
            $options: "i",
        },
    })
        .populate("owner", "name email")
        .sort({ createdAt: -1 });
};
exports.searchRestaurantsService = searchRestaurantsService;
// Get restaurants by category
const getRestaurantsByCategoryService = async (category) => {
    return await restaurant_1.default.find({
        category: {
            $regex: category,
            $options: "i",
        },
    })
        .populate("owner", "name email")
        .sort({ createdAt: -1 });
};
exports.getRestaurantsByCategoryService = getRestaurantsByCategoryService;
