import { useState } from "react";

const UserProfile = () => {
  const [user] = useState({
    firstName: "Jane",
    lastName: "Smith",
    country: "United States",
    city: "San Francisco",
    address: "California",
    email: "client1@gmail.com",
    phone: "+(12)3456 789",
    birthday: "15/08/1990",
    organization: "Company Name",
    role: "React Developer",
    department: "Development",
    zip: "123456",
    profilePic: "/images/user-23.jpg",
  });

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-center">
      {/* Card */}
      <div className="w-full max-w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Personal Information</h1>

        {/* Profile picture and buttons */}
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-0 sm:mr-4 mb-4 sm:mb-0 object-cover"
          />
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Upload picture
            </button>
            <button className="px-4 py-2 bg-gray-300 rounded">Delete</button>
          </div>
        </div>

        {/* User information grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["First Name", "firstName"],
            ["Last Name", "lastName"],
            ["Country", "country"],
            ["City", "city"],
            ["Address", "address"],
            ["Email", "email"],
            ["Phone Number", "phone"],
            ["Birthday", "birthday"],
            ["Organization", "organization"],
            ["Role", "role"],
            ["Department", "department"],
            ["Zip/postal code", "zip"],
          ].map(([label, key]) => (
            <div key={key} className="w-full">
              <label className="block text-gray-600">{label}</label>
              <input
                type="text"
                value={user[key as keyof typeof user]}
                readOnly
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Edit
          </button>
          <button className="px-4 py-2 bg-gray-300 rounded">KYC</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
