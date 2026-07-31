import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";

import { resetPassword } from "../../services/userService";

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Unable to reset password";
  }
  return "Unable to reset password";
};

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasValidTokenFormat = /^[a-f0-9]{64}$/.test(token);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!hasValidTokenFormat) {
      setError("This password reset link is invalid");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      navigate("/login", {
        replace: true,
        state: { passwordReset: true },
      });
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-orange-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl text-orange-600">
          <FaKey />
        </div>
        <h1 className="text-center text-3xl font-black text-gray-900">
          Reset Password
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Choose a new password for your account.
        </p>

        {!hasValidTokenFormat ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            This reset link is missing or invalid. Request a new link from the
            forgot-password page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div>
              <label
                htmlFor="new-reset-password"
                className="mb-2 block font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-reset-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-reset-password"
                className="mb-2 block font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-reset-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <Link
          to="/forgot-password"
          className="mt-6 block text-center font-semibold text-orange-600 hover:underline"
        >
          Request another reset link
        </Link>
      </section>
    </main>
  );
}

export default ResetPassword;
