import { calculateOrderTotal } from "../src/utils/orderTotal";

describe("server-calculated order totals", () => {
  it("calculates delivery, tax, and discount on the server", () => {
    expect(calculateOrderTotal(400, 100)).toEqual({
      subtotal: 400,
      discountAmount: 100,
      deliveryFee: 40,
      taxes: 15,
      totalAmount: 355,
    });
  });

  it("caps a discount at the subtotal", () => {
    expect(calculateOrderTotal(100, 500).totalAmount).toBe(40);
  });
});
