import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/user";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

export const getRestaurantOwners = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const owners = await User.find({ role: "restaurant_owner" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(true, "Restaurant owners fetched successfully", owners)
    );
  }
);

export const updateRestaurantOwnerStatus = asyncHandler(
  async (
    req: AuthRequest<
      { id: string },
      unknown,
      { status: "approved" | "rejected" }
    >,
    res: Response
  ) => {
    const owner = await User.findOne({
      _id: req.params.id,
      role: "restaurant_owner",
    });

    if (!owner) {
      throw new ApiError(404, "Restaurant owner not found");
    }

    owner.restaurantStatus = req.body.status;
    await owner.save();

    const ownerResponse = owner.toObject();
    delete (ownerResponse as { password?: string }).password;

    res.status(200).json(
      new ApiResponse(
        true,
        `Restaurant owner ${req.body.status} successfully`,
        ownerResponse
      )
    );
  }
);
