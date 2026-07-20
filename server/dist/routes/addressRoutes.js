"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const addressValidator_1 = require("../validators/addressValidator");
const router = express_1.default.Router();
// -------------------------
// User Routes
// -------------------------
// Create Address
router.post("/", authMiddleware_1.protect, addressValidator_1.addressValidator, validateRequest_1.default, addressController_1.createAddress);
// Get My Addresses
router.get("/my-addresses", authMiddleware_1.protect, addressController_1.getMyAddresses);
// Get Address By ID
router.get("/:id", authMiddleware_1.protect, addressValidator_1.addressIdValidator, validateRequest_1.default, addressController_1.getAddressById);
// Update Address
router.put("/:id", authMiddleware_1.protect, addressValidator_1.addressIdValidator, addressValidator_1.addressValidator, validateRequest_1.default, addressController_1.updateAddress);
// Delete Address
router.delete("/:id", authMiddleware_1.protect, addressValidator_1.addressIdValidator, validateRequest_1.default, addressController_1.deleteAddress);
// Set Default Address
router.patch("/default/:id", authMiddleware_1.protect, addressValidator_1.addressIdValidator, validateRequest_1.default, addressController_1.setDefaultAddress);
// -------------------------
// Admin Routes
// -------------------------
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, addressValidator_1.addressQueryValidator, validateRequest_1.default, addressController_1.getAllAddresses);
exports.default = router;
