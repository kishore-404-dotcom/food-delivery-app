"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAddresses = exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.getAddressById = exports.getMyAddresses = exports.createAddress = void 0;
// Middleware
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// Services
const addressService_1 = require("../services/addressService");
// Utils
const apiResponse_1 = require("../utils/apiResponse");
// -------------------------
// Create Address
// -------------------------
exports.createAddress = (0, asyncHandler_1.default)(async (req, res) => {
    const address = await (0, addressService_1.createAddressService)(req.user.id, req.body);
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Address created successfully", address));
});
// -------------------------
// Get My Addresses
// -------------------------
exports.getMyAddresses = (0, asyncHandler_1.default)(async (req, res) => {
    const addresses = await (0, addressService_1.getMyAddressesService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Addresses fetched successfully", addresses));
});
// -------------------------
// Get Address By ID
// -------------------------
exports.getAddressById = (0, asyncHandler_1.default)(async (req, res) => {
    const address = await (0, addressService_1.getAddressByIdService)(req.params.id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Address fetched successfully", address));
});
// -------------------------
// Update Address
// -------------------------
exports.updateAddress = (0, asyncHandler_1.default)(async (req, res) => {
    const address = await (0, addressService_1.updateAddressService)(req.params.id, req.user.id, req.body);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Address updated successfully", address));
});
// -------------------------
// Delete Address
// -------------------------
exports.deleteAddress = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, addressService_1.deleteAddressService)(req.params.id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Address deleted successfully"));
});
// -------------------------
// Set Default Address
// -------------------------
exports.setDefaultAddress = (0, asyncHandler_1.default)(async (req, res) => {
    const address = await (0, addressService_1.setDefaultAddressService)(req.params.id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Default address updated successfully", address));
});
// -------------------------
// Admin - Get All Addresses
// -------------------------
exports.getAllAddresses = (0, asyncHandler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort ||
        "-createdAt";
    const search = req.query.search;
    const addresses = await (0, addressService_1.getAllAddressesService)(page, limit, sort, search);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Addresses fetched successfully", addresses));
});
