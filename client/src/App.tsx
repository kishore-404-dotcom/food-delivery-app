import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RealtimeProvider } from "./context/RealtimeContext";
import AdminRoute from "./components/auth/AdminRoute";
import GuestRoute from "./components/auth/GuestRoute";
import CustomerRoute from "./components/auth/CustomerRoute";
import RestaurantOwnerRoute from "./components/auth/RestaurantOwnerRoute";

const Home = lazy(() => import("./pages/home/Home"));
const CustomerDashboard = lazy(
  () => import("./pages/dashboard/CustomerDashboard")
);
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const ForgotPassword = lazy(
  () => import("./pages/forgotPassword/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("./pages/resetPassword/ResetPassword")
);
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
const RestaurantDashboard = lazy(
  () => import("./pages/restaurantOwner/RestaurantDashboard")
);

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />

            {/* The complete customer experience requires authentication. */}
            <Route element={<CustomerRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
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

            <Route element={<RestaurantOwnerRoute />}>
              <Route
                path="/restaurant/dashboard"
                element={<RestaurantDashboard />}
              />
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
