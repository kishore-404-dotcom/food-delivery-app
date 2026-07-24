import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/restaurants");
    }
  };

  return (
    <section className="mx-auto -mt-10 w-full max-w-3xl px-4">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg sm:flex-row"
      >
        <input
          type="text"
          placeholder="Search restaurants..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-xl border px-5 py-4 outline-none focus:border-orange-500"
        />

        <button
          type="submit"
          className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600"
        >
          Search
        </button>
      </form>
    </section>
  );
}

export default SearchBar;