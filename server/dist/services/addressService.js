"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAddressesService = exports.setDefaultAddressService = exports.deleteAddressService = exports.updateAddressService = exports.getAddressByIdService = exports.getMyAddressesService = exports.createAddressService = void 0;
const address_1 = __importDefault(require("../models/address"));
const apiError_1 = require("../utils/apiError");
// Add Address
const createAddressService = async (userId, data) => {
    if (data.isDefault) {
        await address_1.default.updateMany({ user: userId }, { isDefault: false });
    }
    const address = await address_1.default.create({
        user: userId,
        ...data,
    });
    return address;
};
exports.createAddressService = createAddressService;
// Get My Addresses
const getMyAddressesService = async (userId) => {
    return await address_1.default.find({
        user: userId,
    }).sort({
        isDefault: -1,
        createdAt: -1,
    });
};
exports.getMyAddressesService = getMyAddressesService;
// Get Address By ID
const getAddressByIdService = async (addressId, userId) => {
    const address = await address_1.default.findById(addressId);
    if (!address) {
        throw new apiError_1.ApiError(404, "Address not found");
    }
    if (address.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized");
    }
    return address;
};
exports.getAddressByIdService = getAddressByIdService;
// Update Address
const updateAddressService = async (addressId, userId, data) => {
    const address = await address_1.default.findById(addressId);
    if (!address) {
        throw new apiError_1.ApiError(404, "Address not found");
    }
    if (address.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized");
    }
    if (data.isDefault) {
        await address_1.default.updateMany({
            user: userId,
        }, {
            isDefault: false,
        });
    }
    Object.assign(address, data);
    await address.save();
    return address;
};
exports.updateAddressService = updateAddressService;
// Delete Address
const deleteAddressService = async (addressId, userId) => {
    const address = await address_1.default.findById(addressId);
    if (!address) {
        throw new apiError_1.ApiError(404, "Address not found");
    }
    if (address.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized");
    }
    await address.deleteOne();
};
exports.deleteAddressService = deleteAddressService;
// Set Default Address
const setDefaultAddressService = async (addressId, userId) => {
    const address = await address_1.default.findById(addressId);
    if (!address) {
        throw new apiError_1.ApiError(404, "Address not found");
    }
    if (address.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized");
    }
    await address_1.default.updateMany({
        user: userId,
    }, {
        isDefault: false,
    });
    address.isDefault = true;
    await address.save();
    return address;
};
exports.setDefaultAddressService = setDefaultAddressService;
// Admin - Get All Addresses
const getAllAddressesService = async (page, limit, sort = "-createdAt", search) => {
    const filter = {};
    if (search) {
        filter.$or = [
            {
                fullName: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                city: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                state: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }
    const skip = (page - 1) * limit;
    const addresses = await address_1.default.find(filter)
        .populate("user", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await address_1.default.countDocuments(filter);
    return {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        addresses,
    };
};
exports.getAllAddressesService = getAllAddressesService;
