const categories = [
  "🍕 Pizza",
  "🍔 Burger",
  "🍗 Chicken",
  "🥗 Salad",
  "🍰 Dessert",
  "🥤 Drinks",
];

function Categories() {
  return (
    <section id="categories" className="mx-auto mt-16 max-w-7xl px-4">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Browse Categories
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <div
            key={category}
            className="cursor-pointer rounded-xl border bg-white p-6 text-center shadow transition hover:shadow-lg"
          >
            {category}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;