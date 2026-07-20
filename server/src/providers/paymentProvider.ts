export interface PaymentProvider {
  createPayment(
    amount: number
  ): Promise<{
    paymentId: string;
    paymentMethod: string;
  }>;
}

export class DummyPaymentProvider
  implements PaymentProvider
{
  async createPayment(amount: number) {
    return {
      paymentId: `PAY_${Date.now()}_${Math.floor(
        Math.random() * 100000
      )}`,
      paymentMethod: "DUMMY",
    };
  }
}