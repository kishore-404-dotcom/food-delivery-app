import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import type { IFood } from "../../types/food";

const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: { food: IFood; quantity: number };
  onUpdateQuantity: (foodId: string, quantity: number) => void;
  onRemove: (foodId: string) => void;
}) {
  const food = item.food;
  const [imgSrc, setImgSrc] = useState(food.image || DEFAULT_FOOD_IMAGE);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border sm:flex-row sm:items-center sm:justify-between">
      {/* Item Info */}
      <div className="flex items-center gap-4">
        <img
          src={imgSrc}
          alt={food.name}
          onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
          className="h-20 w-20 rounded-xl object-cover border"
        />

        <div>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
            {food.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-1">{food.name}</h3>
          <p className="text-sm font-bold text-orange-500">₹{food.price}</p>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between gap-6 sm:justify-end">
        {/* Counter */}
        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-1.5">
          <button
            onClick={() => onUpdateQuantity(food._id, item.quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm hover:bg-orange-50 hover:text-orange-500 transition"
          >
            <FaMinus className="text-xs" />
          </button>

          <span className="w-8 text-center font-bold text-gray-900">
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(food._id, item.quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm hover:bg-orange-50 hover:text-orange-500 transition"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-black text-gray-900">
            ₹{food.price * item.quantity}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(food._id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
          title="Remove Item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

import CouponSelector from "../../components/coupons/CouponSelector";

function Cart() {
  const { cart, cartTotal, loading, updateQuantity, removeItem, clear } =
    useCart();
  const navigate = useNavigate();

  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const handleCouponApplied = (discount: number, code: string) => {
    setCouponDiscount(discount);
    setAppliedCouponCode(code);
  };

  const handleCouponRemoved = () => {
    setCouponDiscount(0);
    setAppliedCouponCode(null);
  };

  const validItems =
    cart?.items?.filter(
      (item) => item.food && typeof item.food === "object" && item.food._id
    ) || [];

  const deliveryFee = cartTotal > 500 || cartTotal === 0 ? 0 : 40;
  const taxes = Math.round((cartTotal - couponDiscount) * 0.05);
  const finalTotal = Math.max(0, cartTotal - couponDiscount + deliveryFee + taxes);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Shopping Cart 🛒
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review items in your cart before checking out
            </p>
          </div>

          {validItems.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm hover:bg-red-50 transition"
            >
              <FaTrash /> Clear Cart
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-700">Updating cart...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && validItems.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Cart is Empty
            </h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added any delicious food items to your cart yet.
            </p>
            <Link
              to="/foods"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 shadow-md"
            >
              <FaArrowLeft /> Explore Food Menu
            </Link>
          </div>
        )}

        {/* Cart Contents & Summary Grid */}
        {!loading && validItems.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items List & Coupons */}
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-4">
                {validItems.map((item) => (
                  <CartItemRow
                    key={(item.food as IFood)._id}
                    item={{ food: item.food as IFood, quantity: item.quantity }}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Coupon Component */}
              <CouponSelector
                orderAmount={cartTotal}
                appliedCode={appliedCouponCode}
                appliedDiscount={couponDiscount}
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
              />

              <div>
                <Link
                  to="/foods"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  <FaArrowLeft /> Add More Items
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-3xl bg-white p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">
                Order Summary
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCouponCode})</span>
                    <span>- ₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Taxes (5%)</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>

                <hr className="my-2 border-gray-100" />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-orange-500">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      couponCode: appliedCouponCode,
                      couponDiscount,
                    },
                  })
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
              >
                Proceed to Checkout <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
