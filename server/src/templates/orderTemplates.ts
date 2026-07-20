export const orderPlacedTemplate = (
  orderId: string
) => {
  return `
      <h1>Order Placed Successfully</h1>

      <p>
      Your order id is:
      ${orderId}
      </p>
    `;
};



export const deliveredTemplate = (
  orderId: string
) => {
  return `
      <h1>Order Delivered</h1>

      <p>
      Your order has been delivered.

      Order Id:
      ${orderId}
      </p>
    `;
};