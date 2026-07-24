import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import type { WishlistContextType } from "../context/WishlistContext";

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
