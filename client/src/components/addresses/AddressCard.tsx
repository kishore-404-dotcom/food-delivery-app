import { FaHome, FaBriefcase, FaMapMarkerAlt, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import type { IAddress } from "../../types/food";

interface AddressCardProps {
  address: IAddress;
  onEdit: (address: IAddress) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (address: IAddress) => void;
}

function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  selectable = false,
  selected = false,
  onSelect,
}: AddressCardProps) {
  const getIcon = () => {
    switch (address.addressType) {
      case "WORK":
        return <FaBriefcase className="text-orange-500" />;
      case "HOME":
        return <FaHome className="text-orange-500" />;
      default:
        return <FaMapMarkerAlt className="text-orange-500" />;
    }
  };

  return (
    <div
      onClick={() => selectable && onSelect && onSelect(address)}
      className={`relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border transition ${
        selectable ? "cursor-pointer hover:border-orange-500" : ""
      } ${selected ? "border-2 border-orange-500 bg-orange-50/20" : ""}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100">
              {getIcon()}
            </div>
            <span className="font-bold text-gray-900">{address.addressType}</span>
          </div>

          <div className="flex items-center gap-2">
            {address.isDefault && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                <FaStar className="text-[10px]" /> Default
              </span>
            )}
          </div>
        </div>

        {/* Name & Phone */}
        <h4 className="font-bold text-gray-900 text-lg">{address.fullName}</h4>
        <p className="text-xs text-gray-500 font-medium">📞 {address.phone}</p>

        {/* Address Lines */}
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
          {address.landmark ? ` (Near ${address.landmark})` : ""}
        </p>
        <p className="text-sm font-medium text-gray-600">
          {address.city}, {address.state} - {address.postalCode}
        </p>
      </div>

      {/* Footer Controls */}
      <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs font-semibold">
        {!address.isDefault ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault(address._id);
            }}
            className="text-orange-500 hover:underline"
          >
            Set as Default
          </button>
        ) : (
          <span className="text-gray-400">Default Address</span>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="flex items-center gap-1 text-gray-600 hover:text-orange-500"
          >
            <FaEdit /> Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address._id);
            }}
            className="flex items-center gap-1 text-gray-400 hover:text-red-500"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
