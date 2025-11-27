import type { UserInfo } from "../types/user-info";

const UserList = () => {
  //Get from API
  const users: UserInfo[] = [
    {
      id: 1,
      username: "janesmith",
      email: "client1@gmail.com",
      firstName: "Jane",
      lastName: "Smith",
      gender: "Female",
      profilePic: "/images/user-23.jpg",
    },
    {
      id: 2,
      username: "johnmiller",
      email: "client2@gmail.com",
      firstName: "John",
      lastName: "Miller",
      gender: "Male",
      profilePic: "/images/user-23.jpg",
    },
    {
      id: 3,
      username: "mariagonzalez",
      email: "client3@gmail.com",
      firstName: "Maria",
      lastName: "Gonzalez",
      gender: "Female",
      profilePic: "/images/user-23.jpg",
    },
    {
      id: 4,
      username: "davidlee",
      email: "client4@gmail.com",
      firstName: "David",
      lastName: "Lee",
      gender: "Male",
      profilePic: "/images/user-23.jpg",
    },
    {
      id: 5,
      username: "alextaylor",
      email: "client5@gmail.com",
      firstName: "Alex",
      lastName: "Taylor",
      gender: "Male",
      profilePic: "/images/user-23.jpg",
    },
    {
      id: 6,
      username: "sophiachan",
      email: "client6@gmail.com",
      firstName: "Sophia",
      lastName: "Chan",
      gender: "Female",
      profilePic: "/images/user-23.jpg",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Users List</h2>

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
                  {/* Avatar */}
                  <td className="px-4 py-2 border-b">
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>

                  {/* Username */}
                  <td className="px-4 py-2 border-b">{user.username}</td>

                  {/* Email */}
                  <td className="px-4 py-2 border-b">{user.email}</td>

                  {/* FirstName */}
                  <td className="px-4 py-2 border-b">{user.firstName}</td>

                  {/* LastName */}
                  <td className="px-4 py-2 border-b">{user.lastName}</td>

                  {/* Gender */}
                  <td className="px-4 py-2 border-b">{user.gender}</td>

                  {/* Actions */}
                  <td className="px-4 py-2 border-b space-x-2">
                    <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                      View
                    </button>

                    <button className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
