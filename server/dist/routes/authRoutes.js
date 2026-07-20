"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authValidator_1 = require("../validators/authValidator");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
// Register user
router.post("/register", authValidator_1.registerValidator, validateRequest_1.default, rateLimiter_1.authLimiter, authController_1.register);
// Login user
router.post("/login", authValidator_1.loginValidator, validateRequest_1.default, rateLimiter_1.authLimiter, authController_1.login);
// Get logged-in user
router.get("/profile", authMiddleware_1.protect, authController_1.getProfile);
exports.default = router;
