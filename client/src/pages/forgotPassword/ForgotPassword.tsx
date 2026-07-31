import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

import { requestPasswordReset } from "../../services/userService";

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Unable to request a reset link";
  }
  return "Unable to request a reset link";
};

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setMessage(await requestPasswordReset(email.trim().toLowerCase()));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-orange-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl text-orange-600">
          <FaEnvelope />
        </div>
        <h1 className="text-center text-3xl font-black text-gray-900">
          Forgot Password?
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Enter your account email and we will send a secure reset link.
        </p>

        {message ? (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                placeholder="Enter your email"
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 font-semibold text-orange-600 hover:underline"
        >
          <FaArrowLeft /> Back to Login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPassword;
