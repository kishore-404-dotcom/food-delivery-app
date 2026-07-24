import Razorpay from "razorpay";

import {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../config/env";

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
}

export class RazorpayPaymentProvider {
  private readonly client: Razorpay;

  constructor() {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay server credentials are not configured");
    }

    this.client = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(
    amountInPaise: number,
    receipt: string,
    notes: Record<string, string>
  ): Promise<RazorpayOrderResult> {
    const order = await this.client.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes,
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
    };
  }
}
