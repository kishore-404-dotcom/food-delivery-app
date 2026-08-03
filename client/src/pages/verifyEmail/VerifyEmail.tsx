import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import {
  resendEmailVerificationOtp,
  verifyEmailOtp,
} from "../../services/userService";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data as
    | { message?: string; error?: string }
    | undefined;

  if (!error.response) {
    return "Cannot connect to the server. Check your connection and try again.";
  }

  return data?.message || data?.error || fallback;
};

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email")?.trim() || "");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registrationStarted = Boolean(
    (location.state as { registrationStarted?: boolean } | null)
      ?.registrationStarted
  );

  const normalizedEmail = email.trim().toLowerCase();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const otpIsValid = /^\d{6}$/.test(otp);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!emailIsValid || !otpIsValid) {
      setError("Enter a valid email address and the 6-digit OTP from your email.");
      return;
    }

    try {
      setVerifying(true);
      const message = await verifyEmailOtp(normalizedEmail, otp);
      toast.success(message);
      navigate("/login", {
        replace: true,
        state: { emailVerified: true },
      });
    } catch (verifyError: unknown) {
      setError(getErrorMessage(verifyError, "Unable to verify email."));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);

    if (!emailIsValid) {
      setError("Enter the valid email address used during registration.");
      return;
    }

    try {
      setResending(true);
      const message = await resendEmailVerificationOtp(normalizedEmail);
      setOtp("");
      toast.success(message);
    } catch (resendError: unknown) {
      setError(getErrorMessage(resendError, "Unable to resend the OTP."));
    } finally {
      setResending(false);
    }
  };

  const busy = verifying || resending;

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-orange-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Verify Your Email
        </h1>

        <p className="mb-7 text-center text-gray-500">
          Enter the six-digit OTP sent to your email. We never send this OTP by
          SMS or phone call.
        </p>

        {registrationStarted && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800"
          >
            Account created. Check your inbox and spam folder for the OTP.
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-5" noValidate>
          <div>
            <label htmlFor="verification-email" className="mb-2 block font-medium text-gray-700">
              Email
            </label>
            <input
              id="verification-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy}
              placeholder="Enter your registered email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="email-otp" className="mb-2 block font-medium text-gray-700">
              Email OTP
            </label>
            <input
              id="email-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={busy}
              placeholder="Enter 6-digit OTP"
              aria-describedby={error ? "verification-error" : undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {error && (
            <p
              id="verification-error"
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !emailIsValid || !otpIsValid}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {verifying && <ClipLoader size={18} color="#ffffff" />}
            {verifying ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={busy || !emailIsValid}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-500 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-orange-200 disabled:text-orange-300"
          >
            {resending && <ClipLoader size={18} color="#ea580c" />}
            {resending ? "Sending..." : "Resend Email OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already verified?{" "}
          <Link to="/login" className="font-semibold text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default VerifyEmail;
