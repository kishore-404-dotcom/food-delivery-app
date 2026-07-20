"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFoodService = exports.updateFoodService = exports.getFoodByIdService = exports.getFoodsByCategoryService = exports.searchFoodsService = exports.getFoodsService = exports.createFoodService = void 0;
const food_1 = __importDefault(require("../models/food"));
const apiError_1 = require("../utils/apiError");
const cacheService_1 = require("./cacheService");
// Create food
const createFoodService = async (foodData) => {
    return await food_1.default.create(foodData);
};
exports.createFoodService = createFoodService;
// Get all foods
const getFoodsService = async () => {
    const cachedFoods = await (0, cacheService_1.getCache)("foods");
    if (cachedFoods) {
        return JSON.parse(cachedFoods);
    }
    const foods = await food_1.default.find()
        .populate("restaurant")
        .sort({ createdAt: -1 });
    await (0, cacheService_1.setCache)("foods", foods);
    return foods;
};
exports.getFoodsService = getFoodsService;
// Search foods
const searchFoodsService = async (name) => {
    return await food_1.default.find({
        name: {
            $regex: name,
            $options: "i",
        },
    })
        .populate("restaurant")
        .sort({ createdAt: -1 });
};
exports.searchFoodsService = searchFoodsService;
// Get foods by category
const getFoodsByCategoryService = async (category) => {
    return await food_1.default.find({
        category: {
            $regex: category,
            $options: "i",
        },
    })
        .populate("restaurant")
        .sort({ createdAt: -1 });
};
exports.getFoodsByCategoryService = getFoodsByCategoryService;
// Get food by ID
const getFoodByIdService = async (id) => {
    const food = await food_1.default.findById(id)
        .populate("restaurant");
    if (!food) {
        throw new apiError_1.ApiError(404, "Food not found");
    }
    return food;
};
exports.getFoodByIdService = getFoodByIdService;
// Update food
const updateFoodService = async (id, data) => {
    const food = await food_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!food) {
        throw new apiError_1.ApiError(404, "Food not found");
    }
    return food;
};
exports.updateFoodService = updateFoodService;
// Delete food
const deleteFoodService = async (id) => {
    const food = await food_1.default.findById(id);
    if (!food) {
        throw new apiError_1.ApiError(404, "Food not found");
    }
    await food.deleteOne();
};
exports.deleteFoodService = deleteFoodService;
