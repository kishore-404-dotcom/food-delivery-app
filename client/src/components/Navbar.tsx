import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-orange-500"
        >
          Foodie
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 font-medium md:flex">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/restaurants">Restaurants</Link>
          </li>

          <li>
            <a href="#categories">Menu</a>
          </li>

          <li>
            <a href="#why-us">Why Us</a>
          </li>

          <li>
            <a href="#footer">Contact</a>
          </li>
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/cart"
            className="relative"
          >
            <FaShoppingCart size={24} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
              0
            </span>
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl md:hidden"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <ul className="flex flex-col">

          {/* Home */}
          <li>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 hover:bg-orange-50"
            >
              Home
            </Link>
          </li>

          {/* Restaurants */}
          <li>
            <Link
              to="/restaurants"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 hover:bg-orange-50"
            >
              Restaurants
            </Link>
          </li>

          {/* Menu */}
          <li>
            <a
              href="#categories"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 hover:bg-orange-50"
            >
              Menu
            </a>
          </li>

          {/* Why Us */}
          <li>
            <a
              href="#why-us"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 hover:bg-orange-50"
            >
              Why Us
            </a>
          </li>

          {/* Contact */}
          <li>
            <a
              href="#footer"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 hover:bg-orange-50"
            >
              Contact
            </a>
          </li>

          {/* Cart */}
          <li>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block border-b px-6 py-4 hover:bg-orange-50"
            >
              🛒 Cart
            </Link>
          </li>

          {/* Login */}
          <li>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block px-6 py-4 font-semibold text-orange-500 hover:bg-orange-50"
            >
              Login
            </Link>
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;