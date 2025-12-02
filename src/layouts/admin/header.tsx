import { useState, useEffect } from "react";
import RightUserInfo from "./right-user-info";
import { useUserContext } from "./user-context";

const Header = () => {
  const { users, setFilteredUsers } = useUserContext();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [query, users, setFilteredUsers]);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or email"
          className="border rounded-lg pl-10 pr-4 py-2 w-72 bg-gray-50 focus:ring-2 focus:ring-blue-600"
        />
        <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
      </div>

      {/* Right icons */}
      <RightUserInfo />
    </div>
  );
};

export default Header;
