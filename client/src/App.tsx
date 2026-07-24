import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/notFound/NotFound";
import RestaurantsPage from "./pages/restaurants/RestaurantsPage";
import RestaurantDetailPage from "./pages/restaurants/RestaurantDetailPage";
import FoodsPage from "./pages/foods/FoodsPage";

import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrdersPage from "./pages/orders/OrdersPage";
import PaymentsPage from "./pages/payments/PaymentsPage";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/foods" element={<FoodsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={
                <div className="min-h-screen p-8 text-center">
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="mt-2 text-gray-600">
                    Welcome to Admin Control Panel (Management features will be connected in Phase 12)
                  </p>
                </div>
              }
            />
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;