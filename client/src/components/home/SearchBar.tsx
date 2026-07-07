function SearchBar() {
  return (
    <section className="mx-auto -mt-10 w-full max-w-3xl px-4">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg sm:flex-row">
        <input
          type="text"
          placeholder="Search your favourite food..."
          className="flex-1 rounded-xl border px-5 py-4 outline-none"
        />

        <button className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600">
          Search
        </button>
      </div>
    </section>
  );
}

export default SearchBar;