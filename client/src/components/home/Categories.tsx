import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Chicken", icon: "🍗" },
  { name: "Salad", icon: "🥗" },
  { name: "Dessert", icon: "🍰" },
  { name: "Drinks", icon: "🥤" },
];

function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/restaurants?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section id="categories" className="mx-auto mt-16 max-w-7xl px-4">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Browse Categories
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center justify-center rounded-xl border bg-white p-6 text-center font-medium shadow transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;