import { useState, useEffect } from "react";
import type { UserInfo } from "../../types/user-info";


interface SearchProps {
  users: UserInfo[];
  onSearch: (filtered: UserInfo[]) => void;
}

const Search = ({ users, onSearch }: SearchProps) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    onSearch(filtered);
  }, [query, users, onSearch]);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by username or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-lg pl-10 pr-4 py-2 w-72 bg-gray-50 focus:ring-2 focus:ring-blue-600"
        />
        <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
      </div>
    </div>
  );
};

export default Search;
