"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const foodValidator_1 = require("../validators/foodValidator");
const foodController_1 = require("../controllers/foodController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Create food
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMiddleware_1.default.single("image"), foodValidator_1.foodValidator, validateRequest_1.default, foodController_1.createFood);
// Get all foods
router.get("/", foodController_1.getFoods);
// Search foods
router.get("/search", foodController_1.searchFoods);
// Get foods by category
router.get("/category/:category", foodController_1.getFoodsByCategory);
// Get food by ID
router.get("/:id", foodController_1.getFood);
// Update food (supports multipart/form-data optional image upload)
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMiddleware_1.default.single("image"), foodController_1.updateFood);
// Update food image
router.put("/:id/image", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMiddleware_1.default.single("image"), foodController_1.updateFoodImage);
// Delete food
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, foodController_1.deleteFood);
exports.default = router;
