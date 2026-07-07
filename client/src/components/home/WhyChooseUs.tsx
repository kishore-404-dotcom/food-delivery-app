import { FaShippingFast, FaHamburger, FaStar } from "react-icons/fa";

function WhyChooseUs() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-6">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Why Choose Foodie?
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <FaShippingFast className="mx-auto text-5xl text-orange-500" />
          <h3 className="mt-4 text-2xl font-semibold">Fast Delivery</h3>
          <p className="mt-3 text-gray-600">
            Get your favourite food delivered in under 30 minutes.
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <FaHamburger className="mx-auto text-5xl text-orange-500" />
          <h3 className="mt-4 text-2xl font-semibold">Fresh Food</h3>
          <p className="mt-3 text-gray-600">
            Prepared with fresh ingredients every single day.
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <FaStar className="mx-auto text-5xl text-orange-500" />
          <h3 className="mt-4 text-2xl font-semibold">Best Quality</h3>
          <p className="mt-3 text-gray-600">
            Highly rated restaurants and delicious meals.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;