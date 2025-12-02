import { useEffect, useState } from "react";
import type { UserInfo } from "../types/user-info";
import { ADMIN_URL, API_URL_GET_LIST_USERS } from "../constant/url";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../layouts/admin/user-context";

const UserList = () => {
  const navigate = useNavigate();

  const {
    users,
    filteredUsers,
    setFilteredUsers,
    loading: contextLoading,
  } = useUserContext();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- Pagination state ----------
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Fetch users only if context empty
  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length > 0) return;
      try {
        const response = await fetch(API_URL_GET_LIST_USERS);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setFilteredUsers(data.users);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchUsers();
  }, [users, setFilteredUsers]);

  // Pagination compute
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const startIndex = (page - 1) * limit;
  const currentPageUsers = filteredUsers.slice(startIndex, startIndex + limit);

  // Auto-fix page when data changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // Delete user
  const handleDeleteUser = (id: number) => {
    const updated = filteredUsers.filter((user) => user.id !== id);
    setFilteredUsers(updated);
    setConfirmDeleteId(null);

    const newTotalPages = Math.max(1, Math.ceil(updated.length / limit));
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  };

  if (contextLoading)
    return <p className="text-center py-4">Loading users...</p>;
  if (error)
    return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Client List</h2>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">#</th> {/* New column */}
              <th className="px-4 py-2 border-b">Avatar</th>
              <th className="px-4 py-2 border-b">Username</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">FirstName</th>
              <th className="px-4 py-2 border-b">LastName</th>
              <th className="px-4 py-2 border-b">Gender</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPageUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              currentPageUsers.map((user: UserInfo, i) => (
                <tr key={user.id} className="hover:bg-gray-50">

                  {/* # column */}
                  <td className="px-4 py-2 border-b">
                    {startIndex + i + 1}
                  </td>

                  <td className="px-4 py-2 border-b">
                    <img
                      src={
                        user.image ||
                        (user.gender === "male"
                          ? "/images/male.jpg"
                          : "/images/female.jpg")
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>

                  <td className="px-4 py-2 border-b">{user.username}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.firstName}</td>
                  <td className="px-4 py-2 border-b">{user.lastName}</td>
                  <td className="px-4 py-2 border-b">{user.gender}</td>

                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() =>
                        navigate(`${ADMIN_URL.PROFILE}/${user.id}`)
                      }
                      className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 cursor-pointer"
                    >
                      View
                    </button>

                    {confirmDeleteId === user.id ? (
                      <>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(user.id)}
                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {/* Previous */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-4 py-2 rounded border ${
                num === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {num}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
