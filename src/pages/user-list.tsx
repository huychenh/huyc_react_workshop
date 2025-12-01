import { useEffect, useState } from "react";
import type { UserInfo } from "../types/user-info";
import { ADMIN_URL, API_URL_GET_LIST_USERS } from "../constant/url";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL_GET_LIST_USERS);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center py-4">Loading users...</p>;
  }

  if (error) {
    return <p className="text-center py-4 text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Client List</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: UserInfo) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <img
                      src={
                        user.image ||
                        (user.gender === "male" ? "/images/male.jpg" : "/images/female.jpg")
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
                      onClick={() => navigate(`${ADMIN_URL.PROFILE}/${user.id}`)}
                      className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 cursor-pointer"
                    >
                      View
                    </button>
                    <button className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
