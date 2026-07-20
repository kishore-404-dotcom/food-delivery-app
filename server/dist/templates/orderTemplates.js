"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveredTemplate = exports.orderPlacedTemplate = void 0;
const orderPlacedTemplate = (orderId) => {
    return `
      <h1>Order Placed Successfully</h1>

      <p>
      Your order id is:
      ${orderId}
      </p>
    `;
};
exports.orderPlacedTemplate = orderPlacedTemplate;
const deliveredTemplate = (orderId) => {
    return `
      <h1>Order Delivered</h1>

      <p>
      Your order has been delivered.

      Order Id:
      ${orderId}
      </p>
    `;
};
exports.deliveredTemplate = deliveredTemplate;
