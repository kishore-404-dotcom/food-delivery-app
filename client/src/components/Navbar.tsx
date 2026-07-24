import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaClipboardList,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserShield,
  FaStore,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useRealtime } from "../hooks/useRealtime";
import { useWishlist } from "../hooks/useWishlist";

const navigationLinks = [
  { label: "Home", scrollTo: "top" },
  { label: "Menu", scrollTo: "menu" },
  { label: "Why Us", scrollTo: "why-us" },
  { label: "Contact", scrollTo: "contact" },
] as const;

function Navbar() {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isRestaurantOwner,
    loading,
    logout,
  } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadNotifications } = useRealtime();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate("/login");
  };

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-3xl font-extrabold text-orange-500">Foodie</span>
          <div
            className="h-10 w-28 animate-pulse rounded-xl bg-orange-100"
            aria-hidden="true"
          />
        </div>
      </nav>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-3xl font-extrabold text-orange-500">Foodie</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  if (isRestaurantOwner) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/restaurant/dashboard"
            className="text-3xl font-extrabold text-orange-500"
          >
            Foodie
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/restaurant/dashboard"
              className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600 sm:px-4"
            >
              <FaStore /> <span className="hidden sm:inline">Restaurant Dashboard</span>
            </Link>
            <span className="hidden text-sm font-semibold text-gray-700 md:inline">
              {user.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  if (isAdmin) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/admin" className="text-3xl font-extrabold text-orange-500">
            Foodie
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600 sm:px-4"
            >
              <FaUserShield /> <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
            <span className="hidden text-sm font-semibold text-gray-700 md:inline">
              {user.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          state={{ scrollTo: "top" }}
          onClick={closeMenus}
          className="text-3xl font-extrabold text-orange-500"
        >
          Foodie
        </Link>

        <ul className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
          {navigationLinks.map((link) => (
            <li key={link.label}>
              <Link
                to="/"
                state={{ scrollTo: link.scrollTo }}
                className="transition hover:text-orange-500"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 font-bold text-orange-600 hover:text-orange-700"
              >
                <FaUserShield /> Admin Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/cart"
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative text-gray-700 transition hover:text-orange-500"
          >
            <FaShoppingCart size={22} />
            <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white shadow">
              {cartCount}
            </span>
          </Link>

          <Link
            to="/notifications"
            aria-label={`${unreadNotifications} unread notifications`}
            className="relative text-gray-700 transition hover:text-orange-500"
          >
            <FaBell size={21} />
            {unreadNotifications > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((current) => !current)}
              aria-expanded={isUserMenuOpen}
              aria-label="Open account menu"
              className="flex items-center gap-2 rounded-full border bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                <FaUser />
              </span>
              <span>{user.name}</span>
              {isAdmin && (
                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                  ADMIN
                </span>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                <Link
                  to="/dashboard"
                  onClick={closeMenus}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                >
                  <FaTachometerAlt className="text-gray-400" /> Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                >
                  <FaUser className="text-gray-400" /> My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={closeMenus}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                >
                  <FaClipboardList className="text-gray-400" /> My Orders
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMenus}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                >
                  <span className="flex items-center gap-2.5">
                    <FaHeart className="text-gray-400" /> My Wishlist
                  </span>
                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
                  >
                    <FaUserShield /> Admin Panel
                  </Link>
                )}

                <hr className="my-1 border-gray-100" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          className="text-2xl text-gray-700 md:hidden"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-[700px] opacity-100" : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col">
          {navigationLinks.map((link) => (
            <li key={link.label}>
              <Link
                to="/"
                state={{ scrollTo: link.scrollTo }}
                onClick={closeMenus}
                className="block border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/cart"
              onClick={closeMenus}
              className="flex items-center justify-between border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
            >
              <span className="flex items-center gap-2"><FaShoppingCart /> Cart</span>
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              onClick={closeMenus}
              className="flex items-center gap-2 border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
            >
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              onClick={closeMenus}
              className="flex items-center gap-2 border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
            >
              <FaUser /> Profile ({user.name})
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              onClick={closeMenus}
              className="flex items-center justify-between border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
            >
              <span className="flex items-center gap-2"><FaBell /> Notifications</span>
              {unreadNotifications > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              onClick={closeMenus}
              className="flex items-center gap-2 border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
            >
              <FaClipboardList /> My Orders
            </Link>
          </li>
          <li>
            <Link
              to="/wishlist"
              onClick={closeMenus}
              className="flex items-center justify-between border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
            >
              <span className="flex items-center gap-2"><FaHeart /> My Wishlist</span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link
                to="/admin"
                onClick={closeMenus}
                className="flex items-center gap-2 border-b px-6 py-4 font-bold text-orange-600 hover:bg-orange-50"
              >
                <FaUserShield /> Admin Dashboard
              </Link>
            </li>
          )}

          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-6 py-4 text-left font-bold text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
