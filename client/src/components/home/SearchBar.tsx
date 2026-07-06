function SearchBar() {
  return (
    <section className="mt-10 flex justify-center px-4">
      <div className="flex w-full max-w-xl rounded-full border border-gray-300 bg-white p-2 shadow-md">
        <input
          type="text"
          placeholder="Search your favourite food..."
          className="flex-1 rounded-full px-4 py-2 outline-none"
        />

        <button className="rounded-full bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600">
          Search
        </button>
      </div>
    </section>
  );
}

export default SearchBar;