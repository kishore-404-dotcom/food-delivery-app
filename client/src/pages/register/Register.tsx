import { Link } from "react-router-dom";

function Register() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <button className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600">
            Register
          </button>
        </form>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;