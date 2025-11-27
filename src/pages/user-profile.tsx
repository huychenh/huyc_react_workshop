import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL_GET_USER_BY_ID, API_URL_UPDATE_USER } from "../constant/url";
import type { UserInfoFull } from "../types/user-info-full";

const UserProfile = () => {
  const { id } = useParams();

  // --- Hooks top-level ---
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
        setOriginalUser(data); // lưu bản gốc để Cancel
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

    if (key === "address") {
      setUser({
        ...user,
        address: {
          ...user.address,
          city: label === "City" ? value : user.address?.city,
          address: label === "Address" ? value : user.address?.address,
          postalCode: label === "Zip/postal code" ? value : user.address?.postalCode,
        },
      });
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
      setOriginalUser(data); // cập nhật gốc sau khi save
      setSuccessMessage("User updated successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    if (!originalUser) return;
    setUser(originalUser);
    setIsEditing(false);
  };

  if (loading)
    return <div className="p-6 text-center text-lg font-medium">Loading user information...</div>;
  if (error || !user)
    return <div className="p-6 text-center text-red-500 text-lg font-medium">{error || "User not found"}</div>;

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-full bg-white rounded-lg shadow-md p-6">
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-center">
            {successMessage}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Personal Information</h1>

        {/* Avatar + Buttons */}
        <div className="flex mb-6 gap-6">
          {/* Left: Avatar */}
          <div className="flex-shrink-0">
            <img
              src={user.avatar || (user.gender === "male" ? "/images/male.jpg" : "/images/female.jpg")}
              alt="Profile"
              className="w-24 h-full rounded-full object-cover border border-gray-300"
              style={{ minHeight: "120px" }}
            />
          </div>

          {/* Right: Text + Buttons */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Profile Picture</h2>
              <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size of 800KB</p>
            </div>

            {isEditing && (
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
                  onClick={() => {
                    if (!user) return;
                    setUser({ ...user, avatar: "" });
                  }}
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
            ["City", "address"],
            ["Address", "address"],
            ["Email", "email"],
            ["Phone Number", "phone"],
            ["Birthday", "birthDate"],
            ["Organization", "company"],
            ["Role", "company"],
            ["Department", "company"],
            ["Zip/postal code", "address"],
          ].map(([label, key]) => {
            let value = "";
            if (key === "company") {
              if (label === "Organization") value = user.company?.name || "";
              if (label === "Role") value = user.company?.title || "";
              if (label === "Department") value = user.company?.department || "";
            } else if (key === "address") {
              if (label === "City") value = user.address?.city || "";
              if (label === "Address") value = user.address?.address || "";
              if (label === "Zip/postal code") value = user.address?.postalCode || "";
            } else {
              value = user[key as keyof UserInfoFull] as string;
            }

            return (
              <div key={label} className="w-full">
                <label className="block text-gray-600">{label}</label>
                <input
                  type="text"
                  value={value}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange(key as string, label, e.target.value)}
                  className={`mt-1 w-full border px-2 py-1 rounded ${
                    isEditing ? "border-blue-500" : "border-gray-300 bg-gray-100"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 bg-blue-600 text-white rounded ${
              saving ? "opacity-50 cursor-not-allowed cursor-pointer" : "hover:bg-blue-700"
            }`}
            onClick={async () => {
              if (isEditing && !saving) await saveUserChanges();
              setIsEditing(!isEditing);
            }}
            disabled={saving}
          >
            {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
          </button>

          {isEditing && (
            <button
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
              onClick={handleCancel}
            >
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
