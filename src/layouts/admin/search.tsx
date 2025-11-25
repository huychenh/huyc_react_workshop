const Search = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg pl-10 pr-4 py-2 w-72 bg-gray-50 focus:ring-2 focus:ring-blue-600"
        />
        <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
      </div>

    </div>
  );
};

export default Search;
