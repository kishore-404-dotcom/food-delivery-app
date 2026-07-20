import Address from "../models/address";

import { ApiError } from "../utils/apiError";

interface AddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  landmark?: string;
  addressType?: "HOME" | "WORK" | "OTHER";
  isDefault?: boolean;
}

// Add Address
export const createAddressService = async (
  userId: string,
  data: AddressData
) => {

  if (data.isDefault) {
    await Address.updateMany(
      { user: userId },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    user: userId,
    ...data,
  });

  return address;

};

// Get My Addresses
export const getMyAddressesService = async (
  userId: string
) => {

  return await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

};

// Get Address By ID
export const getAddressByIdService = async (
  addressId: string,
  userId: string
) => {

  const address =
    await Address.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  if (
    address.user.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  return address;

};

// Update Address
export const updateAddressService = async (
  addressId: string,
  userId: string,
  data: Partial<AddressData>
) => {

  const address =
    await Address.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  if (
    address.user.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  if (data.isDefault) {

    await Address.updateMany(
      {
        user: userId,
      },
      {
        isDefault: false,
      }
    );

  }

  Object.assign(address, data);

  await address.save();

  return address;

};

// Delete Address
export const deleteAddressService = async (
  addressId: string,
  userId: string
) => {

  const address =
    await Address.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  if (
    address.user.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  await address.deleteOne();

};

// Set Default Address
export const setDefaultAddressService = async (
  addressId: string,
  userId: string
) => {

  const address =
    await Address.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  if (
    address.user.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  await Address.updateMany(
    {
      user: userId,
    },
    {
      isDefault: false,
    }
  );

  address.isDefault = true;

  await address.save();

  return address;

};

// Admin - Get All Addresses
export const getAllAddressesService = async (
  page: number,
  limit: number,
  sort: string = "-createdAt",
  search?: string
) => {

  const filter: any = {};

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

  const skip =
    (page - 1) * limit;

  const addresses =
    await Address.find(filter)
      .populate(
        "user",
        "name email"
      )
      .sort(sort)
      .skip(skip)
      .limit(limit);

  const total =
    await Address.countDocuments(
      filter
    );

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(
      total / limit
    ),
    addresses,
  };

};