import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-md">
      <h1 className="text-2xl font-bold text-orange-500">
        Foodie
      </h1>

      <ul className="flex gap-6">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/cart">Cart</Link>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;