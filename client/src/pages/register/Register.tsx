import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";

import api from "../../services/api";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "customer" | "restaurant_owner";
};

type RegisterResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  data?: {
    token?: string;
  };
};

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { role: "customer" },
  });

  const [showPassword, setShowPassword] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (formData: RegisterForm) => {
    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      };

      const response = await api.post<RegisterResponse>(
        "/auth/register",
        payload
      );

      toast.success(
        response.data.message ||
          "Registration successful! Please login."
      );

      navigate("/login");
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

        let message = "Registration failed";

        if (backendData && typeof backendData === "object") {
          message =
            backendData.message ||
            backendData.error ||
            backendData.errors?.[0]?.msg ||
            backendData.errors?.[0]?.message ||
            message;
        } else if (!error.response) {
          message = "Cannot connect to server. Check network or server status.";
        } else if (error.code === "ECONNABORTED") {
          message = "The server took too long to respond";
        }

        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-orange-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Create Account
        </h1>

        <p className="mb-7 text-center text-gray-500">
          Create a customer account or register as a restaurant partner.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <fieldset>
            <legend className="mb-2 block font-medium text-gray-700">
              Account Type
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="customer"
                  className="peer sr-only"
                  disabled={loading}
                  {...register("role", { required: true })}
                />
                <span className="block rounded-xl border border-gray-300 p-3 text-center text-sm font-semibold text-gray-700 transition peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">
                  Order Food
                </span>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="restaurant_owner"
                  className="peer sr-only"
                  disabled={loading}
                  {...register("role", { required: true })}
                />
                <span className="block rounded-xl border border-gray-300 p-3 text-center text-sm font-semibold text-gray-700 transition peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">
                  Restaurant Partner
                </span>
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Restaurant partner accounts require administrator approval.
            </p>
          </fieldset>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              disabled={loading}
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message:
                    "Name must contain at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message:
                    "Name cannot exceed 50 characters",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

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
              htmlFor="phone"
              className="mb-2 block font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="Enter your 10-digit phone number"
              disabled={loading}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message:
                    "Enter a valid 10-digit phone number",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
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
                autoComplete="new-password"
                placeholder="Create a password"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message:
                      "Password must contain at least 8 characters",
                  },
                  maxLength: {
                    value: 128,
                    message: "Password cannot exceed 128 characters",
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
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Confirm your password"
                disabled={loading}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password ||
                    "Passwords do not match",
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-orange-500 disabled:cursor-not-allowed"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
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

            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
