import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";

import api from "../../services/api";

type LoginForm = {
  email: string;
  password: string;
};

import type { IUser } from "../../types/food";

type LoginResponse = {
  success?: boolean;
  message?: string;

  // Possible response format 1
  token?: string;
  user?: IUser;

  // Possible response format 2
  data?: {
    token?: string;
    user?: IUser;
  };
};

import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordWasReset = Boolean(
    (location.state as { passwordReset?: boolean } | null)?.passwordReset
  );
  const emailWasVerified = Boolean(
    (location.state as { emailVerified?: boolean } | null)?.emailVerified
  );

  const onSubmit = async (formData: LoginForm) => {
    try {
      setLoading(true);

      const response = await api.post<LoginResponse>("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token =
        response.data.token ??
        response.data.data?.token;

      const user =
        response.data.user ??
        response.data.data?.user;

      if (!token || !user) {
        toast.error(
          "Login succeeded, but user data was missing from server"
        );

        return;
      }

      authLogin(token, user);

      toast.success(
        response.data.message || "Login successful!"
      );

      const requestedPath = (location.state as { from?: { pathname?: string } })
        ?.from?.pathname;
      const roleDestination =
        user.role === "admin"
          ? "/admin"
          : user.role === "restaurant_owner"
            ? "/restaurant/dashboard"
            : "/dashboard";
      navigate(requestedPath || roleDestination, { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendData = error.response?.data as
          | {
              message?: string;
              error?: string;
              errors?: Array<{
                msg?: string;
                message?: string;
              }>;
            }
          | undefined;

        let message = "Login failed";

        if (backendData && typeof backendData === "object") {
          message =
            backendData.message ||
            backendData.error ||
            backendData.errors?.[0]?.msg ||
            backendData.errors?.[0]?.message ||
            message;
        } else if (error.code === "ECONNABORTED") {
          message = "The server is taking longer than expected to start. Please try again.";
        } else if (!error.response) {
          message = "Cannot connect to server. Check network or server status.";
        }

        toast.error(message, { toastId: "login-error" });

        if (
          error.response?.status === 403 &&
          message === "Email verification required"
        ) {
          navigate(
            `/verify-email?email=${encodeURIComponent(
              formData.email.trim().toLowerCase()
            )}`
          );
        }
      } else if (error instanceof Error) {
        toast.error(error.message, { toastId: "login-error" });
      } else {
        toast.error("Something went wrong", { toastId: "login-error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-orange-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mb-7 text-center text-gray-500">
          Login to continue ordering your favourite food.
        </p>

        {passwordWasReset && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800"
          >
            Password reset successfully. Login with your new password.
          </p>
        )}

        {emailWasVerified && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800"
          >
            Email verified successfully. Login to continue.
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              disabled={loading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message:
                      "Password must contain at least 6 characters",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-orange-500 disabled:cursor-not-allowed"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-orange-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {loading && (
              <ClipLoader
                size={18}
                color="#ffffff"
              />
            )}

            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
