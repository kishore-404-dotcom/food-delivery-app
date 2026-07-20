export const paymentSuccessTemplate = (
  amount: number
) => {
  return `
      <h1>Payment Successful</h1>

      <p>
      Amount Paid:

      ₹${amount}
      </p>
    `;
};



export const refundTemplate = (
  amount: number
) => {
  return `
      <h1>Refund Successful</h1>

      <p>
      Refund Amount:

      ₹${amount}
      </p>
    `;
};