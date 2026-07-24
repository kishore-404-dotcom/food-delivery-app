import crypto from "crypto";

import { RAZORPAY_KEY_SECRET } from "../config/env";

export const isValidRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(signature, "utf8");

  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

export const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean => {
  if (!RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay server credentials are not configured");
  }

  return isValidRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    signature,
    RAZORPAY_KEY_SECRET
  );
};
