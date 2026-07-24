import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RealtimeProvider } from "./context/RealtimeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import GuestRoute from "./components/auth/GuestRoute";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Cart = lazy(() => import("./pages/cart/Cart"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));
const RestaurantsPage = lazy(() => import("./pages/restaurants/RestaurantsPage"));
const RestaurantDetailPage = lazy(
  () => import("./pages/restaurants/RestaurantDetailPage")
);
const FoodsPage = lazy(() => import("./pages/foods/FoodsPage"));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const PaymentsPage = lazy(() => import("./pages/payments/PaymentsPage"));
const WishlistPage = lazy(() => import("./pages/wishlist/WishlistPage"));
const NotificationsPage = lazy(
  () => import("./pages/notifications/NotificationsPage")
);
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <CartProvider>
          <WishlistProvider>
          <Navbar />

          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center">
                <div
                  className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
                  role="status"
                  aria-label="Loading page"
                />
              </div>
            }
          >
          <Routes>
            {/* Registration and login are the only public routes. */}
            <Route element={<GuestRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* The complete customer experience requires authentication. */}
            <Route element={<ProtectedRoute redirectTo="/register" />}>
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
              <Route path="/foods" element={<FoodsPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

          </Routes>
          </Suspense>
          </WishlistProvider>
        </CartProvider>
      </RealtimeProvider>
    </AuthProvider>
  );
}

export default App;
