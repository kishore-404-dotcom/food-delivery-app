# Razorpay test-mode setup

## Environment variables

Set these only on the backend (`server/.env` locally and Render environment
variables after deployment):

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Do not add either value to Vercel. The browser receives the public key ID from the
authenticated payment-order response; the secret is used only for server-side HMAC
verification.

## Local test

1. Use Razorpay **test mode** credentials.
2. Start the existing backend and frontend.
3. Add cart items and select an address.
4. Verify COD still places an order without opening Razorpay.
5. Select Online Payment and complete Razorpay Checkout with a documented test
   payment method.
6. Confirm navigation occurs only after `/api/payments/verify` returns success.
7. In MongoDB, confirm the payment has `razorpayOrderId`,
   `razorpayPaymentId`, and `status: "SUCCESS"`, while the order has
   `paymentStatus: "PAID"` and `orderStatus: "CONFIRMED"`.
8. Close Checkout and confirm the page offers a retry without creating another
   food order.
9. Use browser network throttling during verification and confirm the retry
   verification action appears.

## Deployment test

1. Set test-mode `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on Render only.
2. Deploy the backend and frontend with the existing API configuration.
3. Repeat successful, failed, closed-checkout, and network-loss tests.
4. Inspect the browser bundle and network responses to confirm the secret is absent.
5. Review the Razorpay test dashboard and MongoDB records together before enabling
   live-mode credentials.

Never use live-mode credentials during this phase.
