"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyPaymentProvider = void 0;
class DummyPaymentProvider {
    async createPayment(amount) {
        return {
            paymentId: `PAY_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
            paymentMethod: "DUMMY",
        };
    }
}
exports.DummyPaymentProvider = DummyPaymentProvider;
