export interface OrderTotal {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxes: number;
  totalAmount: number;
}

export const calculateOrderTotal = (
  subtotal: number,
  discountAmount = 0
): OrderTotal => {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Invalid order subtotal");
  }
  if (!Number.isFinite(discountAmount) || discountAmount < 0) {
    throw new Error("Invalid order discount");
  }

  const safeDiscount = Math.min(discountAmount, subtotal);
  const discountedSubtotal = subtotal - safeDiscount;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const taxes = Math.round(discountedSubtotal * 0.05);

  return {
    subtotal,
    discountAmount: safeDiscount,
    deliveryFee,
    taxes,
    totalAmount: discountedSubtotal + deliveryFee + taxes,
  };
};
