export interface OrderTotal {
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  totalAmount: number;
}

export const calculateOrderTotal = (subtotal: number): OrderTotal => {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Invalid order subtotal");
  }

  const deliveryFee = subtotal > 500 ? 0 : 40;
  const taxes = Math.round(subtotal * 0.05);

  return {
    subtotal,
    deliveryFee,
    taxes,
    totalAmount: subtotal + deliveryFee + taxes,
  };
};
