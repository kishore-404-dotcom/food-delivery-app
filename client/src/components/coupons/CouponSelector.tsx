import { useState, useEffect, useCallback } from "react";
import { FaTag, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getCoupons,
  applyCoupon,
} from "../../services/couponService";
import type { ICoupon } from "../../types/food";

interface CouponSelectorProps {
  orderAmount: number;
  onCouponApplied: (discount: number, code: string) => void;
  onCouponRemoved: () => void;
  appliedCode?: string | null;
  appliedDiscount?: number;
}

export function CouponSelector({
  orderAmount,
  onCouponApplied,
  onCouponRemoved,
  appliedCode,
  appliedDiscount = 0,
}: CouponSelectorProps) {
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<ICoupon[]>([]);
  const [applying, setApplying] = useState(false);

  const fetchAvailableCoupons = useCallback(async () => {
    try {
      const data = await getCoupons();
      // Filter active and non-expired
      const valid = data.filter(
        (c) => c.isActive && new Date(c.expiryDate) > new Date()
      );
      setAvailableCoupons(valid);
    } catch (err: unknown) {
      console.error("Failed to load coupons:", err);
    }
  }, []);

  useEffect(() => {
    fetchAvailableCoupons();
  }, [fetchAvailableCoupons]);

  const handleApply = async (codeToApply: string) => {
    if (!codeToApply.trim()) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    if (orderAmount <= 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setApplying(true);
      const res = await applyCoupon(codeToApply, orderAmount);
      onCouponApplied(res.discount, res.coupon.code);
      setCouponCode("");
      toast.success(`Coupon "${res.coupon.code}" applied! Saved ₹${res.discount}`);
    } catch (error: unknown) {
      console.error("Error applying coupon:", error);
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Failed to apply coupon";
        toast.error(msg);
      } else {
        toast.error("Invalid coupon code");
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
          <FaTag className="text-orange-500" /> Apply Promo Code
        </h3>
        {appliedCode && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            <FaCheck className="text-[10px]" /> Applied: {appliedCode}
          </span>
        )}
      </div>

      {/* Currently Applied Banner */}
      {appliedCode ? (
        <div className="flex items-center justify-between rounded-xl bg-green-50 p-3.5 border border-green-200">
          <div>
            <p className="text-sm font-bold text-green-800">
              Coupon "{appliedCode}" Applied
            </p>
            <p className="text-xs text-green-600 font-medium">
              You saved ₹{appliedDiscount} on this order!
            </p>
          </div>

          <button
            onClick={onCouponRemoved}
            className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-500 shadow-sm border hover:bg-red-50"
          >
            <FaTimes /> Remove
          </button>
        </div>
      ) : (
        /* Code Input */
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code (e.g. SAVE10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none uppercase focus:border-orange-500"
          />
          <button
            onClick={() => handleApply(couponCode)}
            disabled={applying || !couponCode.trim()}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition ${
              couponCode.trim() && !applying
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {applying ? "Checking..." : "Apply"}
          </button>
        </div>
      )}

      {/* Available Coupons List */}
      {!appliedCode && availableCoupons.length > 0 && (
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-500 mb-2">Available Offers:</p>
          <div className="space-y-2">
            {availableCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex items-center justify-between rounded-xl bg-orange-50/60 p-3 border border-orange-100"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-orange-600 text-sm">
                      {coupon.code}
                    </span>
                    <span className="rounded bg-orange-200 px-1.5 py-0.5 text-[10px] font-bold text-orange-800">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {coupon.minOrderAmount > 0
                      ? `Min order: ₹${coupon.minOrderAmount}`
                      : "No minimum order requirement"}
                  </p>
                </div>

                <button
                  onClick={() => handleApply(coupon.code)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-orange-500 shadow-sm border hover:bg-orange-500 hover:text-white transition"
                >
                  Use Code
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponSelector;
