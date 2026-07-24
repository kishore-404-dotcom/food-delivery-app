import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";
import type { IWishlist, IFood } from "../types/food";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import {
  getWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  clearWishlist as apiClearWishlist,
  moveToCart as apiMoveToCart,
} from "../services/wishlistService";

export interface WishlistContextType {
  wishlist: IWishlist | null;
  loading: boolean;
  wishlistCount: number;
  isWishlisted: (foodId: string) => boolean;
  toggleWishlist: (foodId: string, foodName?: string) => Promise<void>;
  removeItem: (foodId: string) => Promise<void>;
  clear: () => Promise<void>;
  moveItemToCart: (foodId: string, foodName?: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const [wishlist, setWishlist] = useState<IWishlist | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlistData = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }

    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(data);
    } catch (err: unknown) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  // Set of wishlisted food IDs for O(1) lookup
  const wishlistedIds = new Set(
    wishlist?.items
      ?.map((item) =>
        typeof item.food === "object" && item.food !== null
          ? (item.food as IFood)._id
          : String(item.food)
      )
      .filter(Boolean) || []
  );

  const isWishlisted = useCallback(
    (foodId: string) => wishlistedIds.has(foodId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (foodId: string, foodName?: string) => {
      if (!isAuthenticated) {
        toast.info("Please login to save items to your wishlist");
        return;
      }

      const currentlyWishlisted = isWishlisted(foodId);

      try {
        if (currentlyWishlisted) {
          const updated = await apiRemoveFromWishlist(foodId);
          setWishlist(updated);
          toast.success(
            foodName ? `${foodName} removed from wishlist` : "Removed from wishlist"
          );
        } else {
          const updated = await apiAddToWishlist(foodId);
          setWishlist(updated);
          toast.success(
            foodName ? `${foodName} added to wishlist!` : "Added to wishlist!"
          );
        }
      } catch (err: unknown) {
        console.error("Error updating wishlist:", err);
        toast.error("Failed to update wishlist");
      }
    },
    [isAuthenticated, isWishlisted]
  );

  const removeItem = useCallback(async (foodId: string) => {
    try {
      const updated = await apiRemoveFromWishlist(foodId);
      setWishlist(updated);
      toast.success("Item removed from wishlist");
    } catch (err: unknown) {
      console.error("Error removing wishlist item:", err);
      toast.error("Failed to remove item from wishlist");
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      await apiClearWishlist();
      setWishlist(null);
      toast.success("Wishlist cleared");
    } catch (err: unknown) {
      console.error("Error clearing wishlist:", err);
      toast.error("Failed to clear wishlist");
    }
  }, []);

  const moveItemToCart = useCallback(
    async (foodId: string, foodName?: string) => {
      try {
        await apiMoveToCart(foodId);
        await refreshCart();
        await fetchWishlistData();
        toast.success(
          foodName ? `${foodName} moved to cart!` : "Moved to cart!"
        );
      } catch (err: unknown) {
        console.error("Error moving item to cart:", err);
        toast.error("Failed to move item to cart");
      }
    },
    [refreshCart, fetchWishlistData]
  );

  const validItems =
    wishlist?.items?.filter(
      (item) => item.food && typeof item.food === "object" && item.food._id
    ) || [];

  const wishlistCount = validItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount,
        isWishlisted,
        toggleWishlist,
        removeItem,
        clear,
        moveItemToCart,
        refreshWishlist: fetchWishlistData,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
