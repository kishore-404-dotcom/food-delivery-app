import burgerImage from "../../assets/images/burger/burger1.jpeg";
import pizzaImage from "../../assets/images/pizza/pizza1.jpeg";
import pastaImage from "../../assets/images/pasta/pasta1.jpeg";
import frenchFriesImage from "../../assets/images/frenchFries/frenchFries1.jpeg";
const foods = [
  {
    id: 1,
    name: "Chicken Burger",
    description: "Fresh crispy chicken burger with cheese.",
    price: 199,
    image: burgerImage,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Loaded with cheese and pepperoni.",
    price: 299,
    image: pizzaImage,
  },
  {
    id: 3,
    name: "Creamy Pasta",
    description: "Rich creamy white sauce pasta.",
    price: 249,
    image: pastaImage,
  },
  {
    id: 4,
    name: "French Fries",
    description: "Crispy golden potato fries.",
    price: 149,
    image: frenchFriesImage,
  },
];

function FoodGrid() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Popular Foods
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {foods.map((food) => (
          <div
            key={food.id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
          >
            <img
              src={food.image}
              alt={food.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold">
                {food.name}
              </h3>

              <p className="mt-2 text-gray-500">
                {food.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-orange-500">
                  ₹{food.price}
                </span>

                <button className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FoodGrid;