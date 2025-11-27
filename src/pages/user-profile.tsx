import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL_GET_USER_BY_ID, API_URL_UPDATE_USER } from "../constant/url";
import type { UserInfoFull } from "../types/user-info-full";

const UserProfile = () => {
  const { id } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isForbidden = storedUser.role === "officer" && storedUser.id !== Number(id);

  const [user, setUser] = useState<UserInfoFull | null>(null);
  const [originalUser, setOriginalUser] = useState<UserInfoFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL_GET_USER_BY_ID(Number(id)));
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
        setOriginalUser(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  // Handle change
  const handleChange = (key: string, label: string, value: string) => {
    if (!user) return;

    if (key === "addresses") {
      const updatedAddresses = [...(user.addresses || [])];
      const index = 0; // assuming first address; adjust if multiple
      if (!updatedAddresses[index]) updatedAddresses[index] = { country: "", city: "", street: "", type: "Mailing" };
      if (label === "City") updatedAddresses[index].city = value;
      if (label === "Address") updatedAddresses[index].street = value;
      if (label === "Zip/postal code") updatedAddresses[index].postalCode = value;
      setUser({ ...user, addresses: updatedAddresses });
    } else if (key === "company") {
      setUser({
        ...user,
        company: {
          ...user.company,
          name: label === "Organization" ? value : user.company?.name,
          title: label === "Role" ? value : user.company?.title,
          department: label === "Department" ? value : user.company?.department,
        },
      });
    } else if (key === "phones") {
      const updatedPhones = [...(user.phones || [])];
      const index = 0; // assuming first phone
      if (!updatedPhones[index]) updatedPhones[index] = { number: "", type: "Personal", preferred: true };
      updatedPhones[index].number = value;
      setUser({ ...user, phones: updatedPhones });
    } else if (key === "emails") {
      const updatedEmails = [...(user.emails || [])];
      const index = 0; // assuming first email
      if (!updatedEmails[index]) updatedEmails[index] = { email: "", type: "Personal", preferred: true };
      updatedEmails[index].email = value;
      setUser({ ...user, emails: updatedEmails });
    } else {
      setUser({ ...user, [key]: value });
    }
  };

  // Save changes
  const saveUserChanges = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const res = await fetch(API_URL_UPDATE_USER(Number(id)), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const data = await res.json();
      setUser(data);
      setOriginalUser(data);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!originalUser) return;
    setUser(originalUser);
    setIsEditing(false);
  };

  if (loading) return <div className="p-6 text-center text-lg font-medium">Loading user information...</div>;
  if (error || !user) return <div className="p-6 text-center text-red-500 text-lg font-medium">{error || "User not found"}</div>;

  const getValue = (key: string, label: string) => {
    if (key === "company") {
      if (label === "Organization") return user.company?.name || "";
      if (label === "Role") return user.company?.title || "";
      if (label === "Department") return user.company?.department || "";
    } else if (key === "addresses") {
      const addr = user.addresses?.[0];
      if (!addr) return "";
      if (label === "City") return addr.city;
      if (label === "Address") return addr.street;
      if (label === "Zip/postal code") return addr.postalCode || "";
    } else if (key === "phones") {
      return user.phones?.[0]?.number || "";
    } else if (key === "emails") {
      return user.emails?.[0]?.email || "";
    } else {
      return user[key as keyof UserInfoFull] as string;
    }
    return "";
  };

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-full bg-white rounded-lg shadow-md p-6">
        {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-center">{successMessage}</div>}
        <h1 className="text-2xl font-bold mb-6">Personal Information</h1>

        {/* Avatar + Buttons */}
        <div className="flex mb-6 gap-6">
          <div className="flex-shrink-0">
            <img
              src={user.avatar || (user.gender === "male" ? "/images/male.jpg" : "/images/female.jpg")}
              alt="Profile"
              className="w-24 h-full rounded-full object-cover border border-gray-300"
              style={{ minHeight: "120px" }}
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Profile Picture</h2>
              <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size of 800KB</p>
            </div>

            {isEditing && !isForbidden && (
              <div className="flex gap-2 mt-4">
                <label className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer text-sm text-center hover:bg-blue-700">
                  Upload Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setUser({ ...user, avatar: url });
                      }
                    }}
                  />
                </label>

                <button
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-400"
                  onClick={() => setUser({ ...user, avatar: "" })}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["First Name", "firstName"],
            ["Last Name", "lastName"],
            ["City", "addresses"],
            ["Address", "addresses"],
            ["Email", "emails"],
            ["Phone Number", "phones"],
            ["Birthday", "birthDate"],
            ["Organization", "company"],
            ["Role", "company"],
            ["Department", "company"],
            ["Zip/postal code", "addresses"],
          ].map(([label, key]) => (
            <div key={label} className="w-full">
              <label className="block text-gray-600">{label}</label>
              <input
                type="text"
                value={getValue(key, label)}
                readOnly={!isEditing || isForbidden}
                onChange={(e) => handleChange(key, label, e.target.value)}
                className={`mt-1 w-full border px-2 py-1 rounded ${
                  isEditing && !isForbidden ? "border-blue-500" : "border-gray-300 bg-gray-100"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded text-white ${
              isForbidden ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={async () => {
              if (isForbidden) return;
              if (isEditing && !saving) await saveUserChanges();
              setIsEditing(!isEditing);
            }}
            disabled={saving || isForbidden}
          >
            {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
          </button>

          {isEditing && !isForbidden && (
            <button className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400" onClick={handleCancel}>
              Cancel
            </button>
          )}

          <button className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400">KYC</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
