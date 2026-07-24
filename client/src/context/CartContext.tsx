import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";
import type { ICart, IFood } from "../types/food";
import { useAuth } from "../hooks/useAuth";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "../services/cartService";

export interface CartContextType {
  cart: ICart | null;
  loading: boolean;
  cartCount: number;
  cartTotal: number;
  addItem: (foodId: string, quantity?: number, foodName?: string) => Promise<void>;
  updateQuantity: (foodId: string, quantity: number) => Promise<void>;
  removeItem: (foodId: string) => Promise<void>;
  clear: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCartData = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err: unknown) {
      console.error("Failed to fetch user cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Add item
  const addItem = useCallback(
    async (foodId: string, quantity: number = 1, foodName?: string) => {
      if (!isAuthenticated) {
        toast.info("Please login to add items to your cart");
        return;
      }

      try {
        const updatedCart = await apiAddToCart(foodId, quantity);
        setCart(updatedCart);
        toast.success(
          foodName ? `${foodName} added to cart!` : "Item added to cart!"
        );
      } catch (err: unknown) {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add item to cart");
      }
    },
    [isAuthenticated]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (foodId: string, quantity: number) => {
      if (quantity <= 0) {
        return removeItem(foodId);
      }

      try {
        const updatedCart = await apiUpdateQuantity(foodId, quantity);
        setCart(updatedCart);
      } catch (err: unknown) {
        console.error("Error updating cart quantity:", err);
        toast.error("Failed to update cart quantity");
      }
    },
    []
  );

  // Remove item
  const removeItem = useCallback(async (foodId: string) => {
    try {
      const updatedCart = await apiRemoveFromCart(foodId);
      setCart(updatedCart);
      toast.success("Item removed from cart");
    } catch (err: unknown) {
      console.error("Error removing item from cart:", err);
      toast.error("Failed to remove item from cart");
    }
  }, []);

  // Clear cart
  const clear = useCallback(async () => {
    try {
      await apiClearCart();
      setCart(null);
      toast.success("Cart cleared");
    } catch (err: unknown) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart");
    }
  }, []);

  // Compute total items
  const cartCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  // Compute total price
  const cartTotal =
    cart?.items?.reduce((total, item) => {
      const foodPrice =
        typeof item.food === "object" && item.food !== null
          ? (item.food as IFood).price || 0
          : 0;
      return total + foodPrice * (item.quantity || 0);
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        refreshCart: fetchCartData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
