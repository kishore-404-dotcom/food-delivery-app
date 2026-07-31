import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPlus,
  FaRedo,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaClipboardList,
  FaHeart,
  FaCreditCard,
  FaBell,
  FaEdit,
  FaKey,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

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
  type CreateAddressInput,
} from "../../services/addressService";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../../services/userService";

function Profile() {
  const { user, updateUser } = useAuth();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [phoneInput, setPhoneInput] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // Sync profile data from backend on load
  const fetchProfileData = useCallback(async () => {
    try {
      const freshUser = await getUserProfile();
      updateUser(freshUser);
      setNameInput(freshUser.name);
      setPhoneInput(freshUser.phone);
    } catch (err: unknown) {
      console.error("Error fetching fresh profile:", err);
    }
  }, [updateUser]);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      setError(null);
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (err: unknown) {
      console.error("Error fetching addresses:", err);
      setError("Failed to fetch address book");
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
    fetchAddresses();
  }, [fetchProfileData, fetchAddresses]);

  // Profile Update Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameInput.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!phoneInput.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }

    try {
      setSavingProfile(true);
      const updatedUser = await updateUserProfile({
        name: nameInput.trim(),
        phone: phoneInput.trim(),
      });

      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // Password Change Submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      toast.error("New password must be between 8 and 128 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Error changing password:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to change password");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  // Address Handlers
  const handleAddressSubmit = async (formData: Partial<CreateAddressInput>) => {
    try {
      setSavingAddress(true);
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
        toast.success("Address updated successfully!");
      } else {
        await createAddress(formData as CreateAddressInput);
        toast.success("Address added successfully!");
      }
      setIsModalOpen(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err: unknown) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address");
    } finally {
      setSavingAddress(false);
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
        <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm border space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
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
                    <FaShieldAlt className="text-orange-400" /> Verified Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-xs font-bold text-orange-600 border border-orange-200 hover:bg-orange-100 transition"
              >
                <FaEdit /> {isEditingProfile ? "Cancel Editing" : "Edit Profile"}
              </button>

              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
              >
                <FaKey /> {isChangingPassword ? "Cancel Password Change" : "Change Password"}
              </button>
            </div>
          </div>

          {/* Edit Profile Form Panel */}
          {isEditingProfile && (
            <form onSubmit={handleProfileSubmit} className="rounded-2xl bg-orange-50/40 p-6 border border-orange-100 space-y-4 text-xs">
              <h3 className="font-bold text-gray-900 text-sm">Edit Account Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-xl border px-4 py-2 font-bold text-gray-600 hover:bg-gray-100"
                >
                  <FaTimes className="inline mr-1" /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl bg-orange-500 px-5 py-2 font-bold text-white shadow hover:bg-orange-600"
                >
                  <FaSave className="inline mr-1" /> {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* Change Password Form Panel */}
          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="rounded-2xl bg-gray-50 p-6 border space-y-4 text-xs">
              <h3 className="font-bold text-gray-900 text-sm">Change Security Password</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">New Password (Min 6 chars) *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="rounded-xl border px-4 py-2 font-bold text-gray-600 hover:bg-gray-100"
                >
                  <FaTimes className="inline mr-1" /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-xl bg-orange-500 px-5 py-2 font-bold text-white shadow hover:bg-orange-600"
                >
                  <FaKey className="inline mr-1" /> {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              to="/orders"
              className="flex items-center gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-100 text-gray-800 transition hover:bg-orange-100 hover:border-orange-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-bold">
                <FaClipboardList />
              </div>
              <div>
                <p className="text-sm font-bold">My Orders</p>
                <p className="text-[11px] text-gray-500">Track history</p>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-100 text-gray-800 transition hover:bg-orange-100 hover:border-orange-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-bold">
                <FaHeart />
              </div>
              <div>
                <p className="text-sm font-bold">My Wishlist</p>
                <p className="text-[11px] text-gray-500">Saved foods</p>
              </div>
            </Link>

            <Link
              to="/payments"
              className="flex items-center gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-100 text-gray-800 transition hover:bg-orange-100 hover:border-orange-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-bold">
                <FaCreditCard />
              </div>
              <div>
                <p className="text-sm font-bold">My Payments</p>
                <p className="text-[11px] text-gray-500">Transactions</p>
              </div>
            </Link>

            <Link
              to="/notifications"
              className="flex items-center gap-3 rounded-2xl bg-orange-50/60 p-4 border border-orange-100 text-gray-800 transition hover:bg-orange-100 hover:border-orange-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-bold">
                <FaBell />
              </div>
              <div>
                <p className="text-sm font-bold">Notifications</p>
                <p className="text-[11px] text-gray-500">Updates & alerts</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Address Management Section */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" /> Saved Delivery Addresses
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Manage your home, office, and preferred delivery locations
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchAddresses}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-gray-700 hover:bg-orange-50"
              >
                <FaRedo /> Refresh
              </button>

              <button
                onClick={() => {
                  setEditingAddress(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600 active:scale-95 transition"
              >
                <FaPlus /> Add New Address
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loadingAddresses && (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-3 text-xs font-medium text-gray-500">Loading addresses...</p>
            </div>
          )}

          {/* Error State */}
          {!loadingAddresses && error && (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-xs text-red-600 border border-red-100">
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchAddresses}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 font-bold text-white shadow"
              >
                <FaRedo /> Retry Now
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loadingAddresses && !error && addresses.length === 0 && (
            <div className="rounded-2xl border border-dashed p-8 text-center text-gray-400">
              <FaMapMarkerAlt className="mx-auto mb-2 text-3xl text-gray-300" />
              <p className="font-bold text-gray-700 text-sm">No Saved Addresses Found</p>
              <p className="text-xs text-gray-500 mt-1">
                Add a delivery address to complete orders easily during checkout.
              </p>
            </div>
          )}

          {/* Address Cards Grid */}
          {!loadingAddresses && !error && addresses.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr._id}
                  address={addr}
                  onSetDefault={handleSetDefault}
                  onEdit={(selected) => {
                    setEditingAddress(selected);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <AddressFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAddress(null);
          }}
          initialData={editingAddress}
          onSubmitAddress={handleAddressSubmit}
          loading={savingAddress}
        />
      )}
    </div>
  );
}

export default Profile;
