import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaPlus,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";
import type { IAddress, IFood } from "../../types/food";
import AddressCard from "../../components/addresses/AddressCard";
import AddressFormModal from "../../components/addresses/AddressFormModal";
import {
  getMyAddresses,
  createAddress,
} from "../../services/addressService";
import type { CreateAddressInput } from "../../services/addressService";
import { placeOrder } from "../../services/orderService";

function CheckoutPage() {
  const { cart, cartTotal, refreshCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Address Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      const data = await getMyAddresses();
      setAddresses(data);

      if (data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr._id : data[0]._id);
      }
    } catch (err: unknown) {
      console.error("Failed to load addresses for checkout:", err);
      toast.error("Failed to load delivery addresses");
    } fontFinally: {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSaveNewAddress = async (formData: Partial<CreateAddressInput>) => {
    try {
      setSavingAddress(true);
      const newAddr = await createAddress(formData);
      toast.success("Address added successfully!");
      setIsModalOpen(false);
      await fetchAddresses();
      setSelectedAddressId(newAddr._id);
    } catch (err: unknown) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const validItems =
    cart?.items?.filter(
      (item) => item.food && typeof item.food === "object" && item.food._id
    ) || [];

  const deliveryFee = cartTotal > 500 || cartTotal === 0 ? 0 : 40;
  const taxes = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (validItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);
      const order = await placeOrder({
        paymentMethod,
        deliveryAddress: selectedAddressId,
      });

      await refreshCart();
      toast.success(`Order #${order._id.substring(order._id.length - 6).toUpperCase()} placed successfully! 🎉`);
      navigate("/orders", { replace: true });
    } catch (err: unknown) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (validItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/foods"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 shadow"
          >
            <FaArrowLeft /> Browse Foods
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:underline mb-2"
          >
            <FaArrowLeft /> Back to Cart
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout 💳</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Controls: Address & Payment */}
          <div className="space-y-8 lg:col-span-2">
            {/* Step 1: Select Delivery Address */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" /> 1. Delivery Address
                </h2>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-orange-500 bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100"
                >
                  <FaPlus /> Add New
                </button>
              </div>

              {loadingAddresses && (
                <div className="py-8 text-center text-sm text-gray-500">
                  Loading saved delivery addresses...
                </div>
              )}

              {!loadingAddresses && addresses.length === 0 && (
                <div className="rounded-2xl border border-dashed p-6 text-center">
                  <p className="text-sm text-gray-600 font-medium">
                    No delivery address found. Please add a delivery address.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow"
                  >
                    Add Address Now
                  </button>
                </div>
              )}

              {!loadingAddresses && addresses.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address._id}
                      address={address}
                      selectable
                      selected={selectedAddressId === address._id}
                      onSelect={(addr) => setSelectedAddressId(addr._id)}
                      onEdit={() => {}}
                      onSetDefault={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6 flex items-center gap-2">
                <FaMoneyBillWave className="text-orange-500" /> 2. Payment Method
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* COD */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    paymentMethod === "COD"
                      ? "border-2 border-orange-500 bg-orange-50/20"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 font-bold">
                        <FaMoneyBillWave size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                        <p className="text-xs text-gray-500">Pay cash upon delivery</p>
                      </div>
                    </div>
                    {paymentMethod === "COD" && (
                      <FaCheckCircle className="text-orange-500 text-xl" />
                    )}
                  </div>
                </div>

                {/* ONLINE */}
                <div
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    paymentMethod === "ONLINE"
                      ? "border-2 border-orange-500 bg-orange-50/20"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
                        <FaCreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Online Payment</h4>
                        <p className="text-xs text-gray-500">UPI / Card / NetBanking</p>
                      </div>
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <FaCheckCircle className="text-orange-500 text-xl" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Final Submit */}
          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">
              Order Review
            </h2>

            {/* Items Summary */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1 mb-4 border-b pb-4">
              {validItems.map((item) => {
                const food = item.food as IFood;
                return (
                  <div key={food._id} className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-800">{food.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity} × ₹{food.price}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{food.price * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{cartTotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes (5%)</span>
                <span className="font-semibold text-gray-900">₹{taxes}</span>
              </div>

              <hr className="my-2 border-gray-100" />

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-orange-500">₹{finalTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-md transition ${
                placingOrder || !selectedAddressId
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 active:scale-95"
              }`}
            >
              {placingOrder ? "Placing Order..." : `Place Order (₹${finalTotal})`}
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitAddress={handleSaveNewAddress}
        loading={savingAddress}
      />
    </div>
  );
}

export default CheckoutPage;
