import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaUserShield,
  FaClipboardList,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold text-orange-500">
          Foodie
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
          <li>
            <Link to="/" className="hover:text-orange-500 transition">
              Home
            </Link>
          </li>

          <li>
            <Link to="/restaurants" className="hover:text-orange-500 transition">
              Restaurants
            </Link>
          </li>

          <li>
            <Link to="/foods" className="hover:text-orange-500 transition">
              Food Menu
            </Link>
          </li>

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

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-700 hover:text-orange-500 transition">
            <FaShoppingCart size={22} />
            <span className="absolute -right-2.5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow">
              0
            </span>
          </Link>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full border bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  <FaUser />
                </div>
                <span>{user.name}</span>
                {isAdmin && (
                  <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                    ADMIN
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 transition"
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  >
                    <FaUser className="text-gray-400" /> My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  >
                    <FaClipboardList className="text-gray-400" /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
                    >
                      <FaUserShield /> Admin Panel
                    </Link>
                  )}

                  <hr className="my-1 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-gray-700 md:hidden"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <ul className="flex flex-col">
          <li>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 text-gray-700 hover:bg-orange-50 font-medium"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/restaurants"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 text-gray-700 hover:bg-orange-50 font-medium"
            >
              Restaurants
            </Link>
          </li>

          <li>
            <Link
              to="/foods"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 text-gray-700 hover:bg-orange-50 font-medium"
            >
              Food Menu
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
                >
                  <span>🛒 Cart</span>
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                    0
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
                >
                  👤 Profile ({user?.name})
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="block border-b px-6 py-4 font-medium text-gray-700 hover:bg-orange-50"
                >
                  📦 My Orders
                </Link>
              </li>

              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block border-b px-6 py-4 font-bold text-orange-600 hover:bg-orange-50"
                  >
                    🛡️ Admin Dashboard
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-6 py-4 font-bold text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block border-b px-6 py-4 font-semibold text-orange-500 hover:bg-orange-50"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-4 font-semibold text-gray-700 hover:bg-orange-50"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;