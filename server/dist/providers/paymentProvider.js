"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayPaymentProvider = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const env_1 = require("../config/env");
class RazorpayPaymentProvider {
    constructor() {
        if (!env_1.RAZORPAY_KEY_ID || !env_1.RAZORPAY_KEY_SECRET) {
            throw new Error("Razorpay server credentials are not configured");
        }
        this.client = new razorpay_1.default({
            key_id: env_1.RAZORPAY_KEY_ID,
            key_secret: env_1.RAZORPAY_KEY_SECRET,
        });
    }
    async createOrder(amountInPaise, receipt, notes) {
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
exports.RazorpayPaymentProvider = RazorpayPaymentProvider;
