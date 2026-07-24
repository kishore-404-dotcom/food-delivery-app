import { useState, useEffect, useCallback } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPlus,
  FaRedo,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import type { IAddress } from "../../types/food";
import AddressCard from "../../components/addresses/AddressCard";
import AddressFormModal from "../../components/addresses/AddressFormModal";
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../../services/addressService";
import type { CreateAddressInput } from "../../services/addressService";

function Profile() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (err: unknown) {
      console.error("Error loading addresses:", err);
      setError("Failed to load saved addresses. The server might be starting up.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (address: IAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (formData: Partial<CreateAddressInput>) => {
    try {
      setSaving(true);
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
        toast.success("Address updated successfully!");
      } else {
        await createAddress(formData);
        toast.success("Address created successfully!");
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err: unknown) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address. Please check input fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (err: unknown) {
      console.error("Error setting default address:", err);
      toast.error("Failed to set default address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (err: unknown) {
      console.error("Error deleting address:", err);
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* User Info Header Card */}
        <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm border">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500 text-3xl text-white font-bold shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    {user?.name}
                  </h1>
                  <span className="rounded-full bg-orange-100 px-3 py-0.5 text-xs font-bold text-orange-600 uppercase">
                    {user?.role}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <FaEnvelope className="text-orange-400" /> {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaPhone className="text-orange-400" /> {user?.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaShieldAlt className="text-orange-400" /> Verified User
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Management Section */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" /> Saved Delivery Addresses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your saved delivery locations for faster checkout.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white shadow-md hover:bg-orange-600 transition"
            >
              <FaPlus /> Add New Address
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-3 font-medium text-gray-600">Loading addresses...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600 border border-red-100">
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchAddresses}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white"
              >
                <FaRedo /> Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && addresses.length === 0 && (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <FaMapMarkerAlt className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">
                No Addresses Saved
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                You haven't added any delivery addresses yet.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-4 rounded-xl bg-orange-500 px-5 py-2 text-xs font-bold text-white hover:bg-orange-600"
              >
                Add Your First Address
              </button>
            </div>
          )}

          {/* Addresses Grid */}
          {!loading && !error && addresses.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  onEdit={handleOpenEditModal}
                  onSetDefault={handleSetDefault}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitAddress={handleSaveAddress}
        initialData={editingAddress}
        loading={saving}
      />
    </div>
  );
}

export default Profile;