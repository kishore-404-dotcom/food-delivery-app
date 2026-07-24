import { useState, useEffect, useCallback } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaRedo,
  FaReceipt,
} from "react-icons/fa";
import { getMyPayments } from "../../services/paymentService";
import type { IPayment, IOrder } from "../../types/food";

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "SUCCESS":
      return (
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          <FaCheckCircle className="text-[10px]" /> Successful
        </span>
      );
    case "FAILED":
      return (
        <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          <FaTimesCircle className="text-[10px]" /> Failed
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
          <FaClock className="text-[10px]" /> Pending
        </span>
      );
  }
}

function PaymentCard({ payment }: { payment: IPayment }) {
  const order =
    typeof payment.order === "object" && payment.order !== null
      ? (payment.order as IOrder)
      : null;

  const dateValue = payment.createdAt ? new Date(payment.createdAt) : new Date();
  const formattedDate = dateValue.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Payment ID:</span>
            <span className="font-extrabold text-gray-900">
              {payment.razorpayPaymentId || payment.razorpayOrderId || payment.paymentId}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <FaCalendarAlt className="text-orange-400" /> {formattedDate}
          </p>
        </div>

        <div>{getPaymentStatusBadge(payment.status)}</div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="space-y-1">
          {order && (
            <p className="font-semibold text-gray-700">
              Order Ref:{" "}
              <span className="font-extrabold text-gray-900">
                #{order._id.substring(order._id.length - 8).toUpperCase()}
              </span>
            </p>
          )}
          <p className="text-gray-500">
            Method:{" "}
            <span className="font-bold text-gray-800 uppercase">
              {payment.paymentMethod}
            </span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Transaction Amount</p>
          <p className="text-2xl font-black text-orange-500">₹{payment.amount}</p>
        </div>
      </div>
    </div>
  );
}

function PaymentsPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyPayments();
      setPayments(data);
    } catch (err: unknown) {
      console.error("Failed to load payment history:", err);
      setError("Failed to fetch payment records. The server might be starting up.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Payment History 💳
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View all payment transactions and gateway records
            </p>
          </div>

          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-orange-50 transition"
          >
            <FaRedo /> Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-600">Loading payment history...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl bg-red-50 p-8 text-center text-red-600 border border-red-100">
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow"
            >
              <FaRedo /> Retry Now
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && payments.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaReceipt size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No Payment History</h2>
            <p className="mt-2 text-gray-500">
              You haven't made any online payment transactions yet.
            </p>
          </div>
        )}

        {/* Payments List */}
        {!loading && !error && payments.length > 0 && (
          <div className="space-y-6">
            {payments.map((payment) => (
              <PaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;
