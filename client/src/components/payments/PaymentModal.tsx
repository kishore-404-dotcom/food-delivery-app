import { useState } from "react";
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import type { IPayment } from "../../types/food";
import {
  markPaymentSuccess,
  markPaymentFailed,
} from "../../services/paymentService";

interface PaymentModalProps {
  isOpen: boolean;
  payment: IPayment | null;
  onClose: () => void;
  onSuccess: (payment: IPayment) => void;
  onFailure: (payment: IPayment) => void;
}

export function PaymentModal({
  isOpen,
  payment,
  onClose,
  onSuccess,
  onFailure,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !payment) return null;

  const handleSuccess = async () => {
    try {
      setProcessing(true);
      const updatedPayment = await markPaymentSuccess(payment._id);
      toast.success("Payment completed successfully! 🎉");
      onSuccess(updatedPayment);
    } catch (err: unknown) {
      console.error("Payment completion error:", err);
      toast.error("Failed to complete payment transaction");
    } finally {
      setProcessing(false);
    }
  };

  const handleFailed = async () => {
    try {
      setProcessing(true);
      const updatedPayment = await markPaymentFailed(payment._id);
      toast.error("Payment failed. Order has been cancelled.");
      onFailure(updatedPayment);
    } catch (err: unknown) {
      console.error("Payment failure simulation error:", err);
      toast.error("Failed to update payment status");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <FaLock />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                Secure Checkout Gateway
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                256-bit Encrypted Transaction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Payment Amount Card */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Total Payable Amount
          </p>
          <h2 className="text-3xl font-black mt-1">₹{payment.amount}</h2>
          <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-[11px]">
            <span>Ref: {payment.paymentId}</span>
            <span className="flex items-center gap-1 font-bold">
              <FaShieldAlt /> 100% Secure
            </span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Select Payment Gateway Mode
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedMethod("upi")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition ${
                selectedMethod === "upi"
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaMobileAlt size={18} /> UPI / GPay
            </button>

            <button
              onClick={() => setSelectedMethod("card")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition ${
                selectedMethod === "card"
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaCreditCard size={18} /> Card
            </button>

            <button
              onClick={() => setSelectedMethod("netbanking")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition ${
                selectedMethod === "netbanking"
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaUniversity size={18} /> Net Banking
            </button>
          </div>
        </div>

        {/* Simulation Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSuccess}
            disabled={processing}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition ${
              processing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:scale-95"
            }`}
          >
            <FaCheckCircle /> {processing ? "Processing..." : "Pay Now (Simulate Success)"}
          </button>

          <button
            onClick={handleFailed}
            disabled={processing}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition ${
              processing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaTimesCircle /> Simulate Payment Failure
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
