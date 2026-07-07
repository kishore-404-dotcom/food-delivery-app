import { FaShoppingCart, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
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

        {/* Navigation */}
        <ul className="hidden items-center gap-8 font-medium md:flex">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/">Menu</Link>
          </li>

          <li>
            <Link to="/">About</Link>
          </li>

          <li>
            <Link to="/">Contact</Link>
          </li>
        </ul>

        {/* Right Side */}
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
          <button className="text-2xl md:hidden">
            <FaBars />
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;