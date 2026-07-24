import crypto from "crypto";

import { calculateOrderTotal } from "../src/utils/orderTotal";
import { isValidRazorpaySignature } from "../src/utils/razorpaySignature";

describe("Razorpay payment security", () => {
  it("accepts a valid Razorpay HMAC signature", () => {
    const orderId = "order_test123";
    const paymentId = "pay_test456";
    const testSecret = "razorpay_test_secret";
    const signature = crypto
      .createHmac("sha256", testSecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(
      isValidRazorpaySignature(orderId, paymentId, signature, testSecret)
    ).toBe(true);
  });

  it("rejects an invalid Razorpay signature", () => {
    expect(
      isValidRazorpaySignature(
        "order_test123",
        "pay_test456",
        "0".repeat(64),
        "razorpay_test_secret"
      )
    ).toBe(false);
  });

  it("calculates the payable amount from the server subtotal", () => {
    expect(calculateOrderTotal(400)).toEqual({
      subtotal: 400,
      deliveryFee: 40,
      taxes: 20,
      totalAmount: 460,
    });
    expect(calculateOrderTotal(600)).toEqual({
      subtotal: 600,
      deliveryFee: 0,
      taxes: 30,
      totalAmount: 630,
    });
  });
});
