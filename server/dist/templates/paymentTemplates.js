"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundTemplate = exports.paymentSuccessTemplate = void 0;
const paymentSuccessTemplate = (amount) => {
    return `
      <h1>Payment Successful</h1>

      <p>
      Amount Paid:

      ₹${amount}
      </p>
    `;
};
exports.paymentSuccessTemplate = paymentSuccessTemplate;
const refundTemplate = (amount) => {
    return `
      <h1>Refund Successful</h1>

      <p>
      Refund Amount:

      ₹${amount}
      </p>
    `;
};
exports.refundTemplate = refundTemplate;
