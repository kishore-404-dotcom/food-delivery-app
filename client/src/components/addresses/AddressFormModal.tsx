import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import type { IAddress } from "../../types/food";
import type { CreateAddressInput } from "../../services/addressService";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAddress: (data: Partial<CreateAddressInput>) => Promise<void>;
  initialData?: IAddress | null;
  loading?: boolean;
}

export function AddressFormModal({
  isOpen,
  onClose,
  onSubmitAddress,
  initialData,
  loading = false,
}: AddressFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<CreateAddressInput>>({
    defaultValues: {
      addressType: "HOME",
      country: "India",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        phone: initialData.phone,
        addressLine1: initialData.addressLine1,
        addressLine2: initialData.addressLine2 || "",
        city: initialData.city,
        state: initialData.state,
        postalCode: initialData.postalCode,
        country: initialData.country || "India",
        landmark: initialData.landmark || "",
        addressType: initialData.addressType || "HOME",
        isDefault: initialData.isDefault || false,
      });
    } else {
      reset({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        landmark: "",
        addressType: "HOME",
        isDefault: false,
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Address 📍" : "Add New Address 📍"}
          </h3>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmitAddress)}
          className="mt-6 space-y-4"
          noValidate
        >
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Kishore Kumar"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Phone Number (10 Digits) *
            </label>
            <input
              type="tel"
              placeholder="e.g. 9994515625"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              })}
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Address Line 1 (Street/House No.) *
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 302, Green Apartments"
              {...register("addressLine1", {
                required: "Address Line 1 is required",
              })}
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
            />
            {errors.addressLine1 && (
              <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Address Line 2 (Area/Locality)
            </label>
            <input
              type="text"
              placeholder="e.g. MG Road, Near Central Park"
              {...register("addressLine2")}
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
            />
          </div>

          {/* City & State Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. Chennai"
                {...register("city", { required: "City is required" })}
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                placeholder="e.g. Tamil Nadu"
                {...register("state", { required: "State is required" })}
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
              />
              {errors.state && (
                <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Postal Code & Landmark Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                placeholder="e.g. 600001"
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
              />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.postalCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Landmark
              </label>
              <input
                type="text"
                placeholder="e.g. Opp. City Mall"
                {...register("landmark")}
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Address Type Pill Radio */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Address Type
            </label>
            <div className="flex gap-3">
              {(["HOME", "WORK", "OTHER"] as const).map((type) => (
                <label
                  key={type}
                  className="flex-1 cursor-pointer rounded-xl border p-2.5 text-center text-xs font-bold text-gray-700 hover:border-orange-400"
                >
                  <input
                    type="radio"
                    value={type}
                    {...register("addressType")}
                    className="mr-1.5 accent-orange-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Is Default Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              {...register("isDefault")}
              className="h-4 w-4 accent-orange-500 rounded"
            />
            <label htmlFor="isDefault" className="text-xs font-medium text-gray-700">
              Set as my default delivery address
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 shadow"
            >
              {loading ? "Saving..." : initialData ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressFormModal;
