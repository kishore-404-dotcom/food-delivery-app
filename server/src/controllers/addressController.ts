import { Response } from "express";

// Middleware
import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

// Services
import {
  createAddressService,
  getMyAddressesService,
  getAddressByIdService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
  getAllAddressesService,
} from "../services/addressService";

// Utils
import { ApiResponse } from "../utils/apiResponse";

// -------------------------
// Request Types
// -------------------------

interface AddressBody {
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

interface AddressQuery {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

// -------------------------
// Create Address
// -------------------------

export const createAddress = asyncHandler(
  async (
    req: AuthRequest<{}, any, AddressBody>,
    res: Response
  ) => {

    const address =
      await createAddressService(
        req.user!.id,
        req.body
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Address created successfully",
        address
      )
    );

  }
);

// -------------------------
// Get My Addresses
// -------------------------

export const getMyAddresses = asyncHandler(
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const addresses =
      await getMyAddressesService(
        req.user!.id
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Addresses fetched successfully",
        addresses
      )
    );

  }
);

// -------------------------
// Get Address By ID
// -------------------------

export const getAddressById = asyncHandler(
  async (
    req: AuthRequest<{ id: string }>,
    res: Response
  ) => {

    const address =
      await getAddressByIdService(
        req.params.id,
        req.user!.id
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Address fetched successfully",
        address
      )
    );

  }
);

// -------------------------
// Update Address
// -------------------------

export const updateAddress = asyncHandler(
  async (
    req: AuthRequest<
      { id: string },
      any,
      Partial<AddressBody>
    >,
    res: Response
  ) => {

    const address =
      await updateAddressService(
        req.params.id,
        req.user!.id,
        req.body
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Address updated successfully",
        address
      )
    );

  }
);

// -------------------------
// Delete Address
// -------------------------

export const deleteAddress = asyncHandler(
  async (
    req: AuthRequest<{ id: string }>,
    res: Response
  ) => {

    await deleteAddressService(
      req.params.id,
      req.user!.id
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Address deleted successfully"
      )
    );

  }
);

// -------------------------
// Set Default Address
// -------------------------

export const setDefaultAddress =
  asyncHandler(
    async (
      req: AuthRequest<{ id: string }>,
      res: Response
    ) => {

      const address =
        await setDefaultAddressService(
          req.params.id,
          req.user!.id
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Default address updated successfully",
          address
        )
      );

    }
  );

// -------------------------
// Admin - Get All Addresses
// -------------------------

export const getAllAddresses =
  asyncHandler(
    async (
      req: AuthRequest<
        {},
        any,
        any,
        AddressQuery
      >,
      res: Response
    ) => {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const sort =
        req.query.sort ||
        "-createdAt";

      const search =
        req.query.search;

      const addresses =
        await getAllAddressesService(
          page,
          limit,
          sort,
          search
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Addresses fetched successfully",
          addresses
        )
      );

    }
  );