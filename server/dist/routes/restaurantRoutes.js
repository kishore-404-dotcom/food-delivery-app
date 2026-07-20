"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurantController_1 = require("../controllers/restaurantController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const restaurantValidator_1 = require("../validators/restaurantValidator");
const router = express_1.default.Router();
// Create restaurant
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMiddleware_1.default.single("image"), restaurantValidator_1.RestaurantValidator, validateRequest_1.default, restaurantController_1.createRestaurant);
// Get all restaurants
router.get("/", restaurantController_1.getAllRestaurants);
// Search restaurants
router.get("/search", restaurantController_1.searchRestaurants);
// Get restaurants by category
router.get("/category/:category", restaurantController_1.getRestaurantsByCategory);
// Get restaurant by ID
router.get("/:id", restaurantController_1.getRestaurantById);
// Update restaurant details
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, restaurantController_1.updateRestaurant);
// Update restaurant image
router.put("/:id/image", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMiddleware_1.default.single("image"), restaurantController_1.updateRestaurantImage);
// Delete restaurant
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, restaurantController_1.deleteRestaurant);
exports.default = router;
