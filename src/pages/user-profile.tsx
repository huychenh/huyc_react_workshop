import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_URL, API_URL_GET_USER_BY_ID, API_URL_UPDATE_USER } from "../constant/url";
import type { UserInfoFull } from "../types/user-info-full";

const normalizeUser = (data: any): UserInfoFull => {
  return {
    id: data.id,
    username: data.username || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    gender: data.gender || "",
    avatar: data.image || "",

    // Basic
    phoneNumber: data.phone || "",
    birthday: data.birthDate || "",

    // Address
    city: data.address?.city || "",
    address: data.address?.address || "",
    zipCode: data.address?.postalCode || "",
    country: data.address?.state || "",

    // Company
    organization: data.company?.name || "",
    role: data.company?.title || "",
    department: data.company?.department || "",
  };
};

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isForbidden = storedUser.role === "officer" && storedUser.id !== Number(id);

  const [user, setUser] = useState<UserInfoFull | null>(null);
  const [originalUser, setOriginalUser] = useState<UserInfoFull | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL_GET_USER_BY_ID(Number(id)));
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        const normalized = normalizeUser(data);

        setUser(normalized);
        setOriginalUser(normalized);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (key: keyof UserInfoFull, value: string) => {
    if (!user) return;
    setUser({ ...user, [key]: value });
  };

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
      const normalized = normalizeUser(data);

      setUser(normalized);
      setOriginalUser(normalized);

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

  // UI -------------------------------------------------------------------------------------

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

        {/* Avatar */}
        <div className="flex mb-6 gap-6 items-center">
          <div className="flex-shrink-0">
            <img
              src={
                user.avatar ||
                (user.gender === "male" ? "/images/male.jpg" : "/images/female.jpg")
              }
              alt="Profile"
              className="w-24 sm:w-32 h-24 sm:h-32 rounded-full object-cover border border-gray-300"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Profile Picture</h2>
              <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size of 800KB</p>
            </div>

            {/* Upload + Delete Buttons */}
            <div className="flex gap-2 mt-4">
              {/* Upload */}
              <label
                className={`px-3 py-1 rounded text-sm cursor-pointer ${!isEditing || isForbidden
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!isEditing || isForbidden}
                  onChange={(e) => {
                    if (!isEditing || isForbidden) return;
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setUser({ ...user, avatar: url });
                    }
                  }}
                />
              </label>

              {/* Delete */}
              <button
                disabled={!isEditing || isForbidden}
                className={`px-3 py-1 rounded text-sm ${!isEditing || isForbidden
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-400"
                  }`}
                onClick={() => {
                  if (!isEditing || isForbidden) return;
                  setUser({ ...user, avatar: "" });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {[
            ["First Name", "firstName"],
            ["Last Name", "lastName"],
            ["Email", "email"],
            ["Phone Number", "phoneNumber"],
            ["City", "city"],
            ["Address", "address"],
            ["Country", "country"],
            ["Birthday", "birthday"],
            ["Organization", "organization"],
            ["Role", "role"],
            ["Department", "department"],
            ["Zip Code", "zipCode"],
          ].map(([label, key]) => (
            <div key={label}>
              <label className="block text-gray-600">{label}</label>
              <input
                type="text"
                value={(user as any)[key] || ""}
                readOnly={!isEditing || isForbidden}
                onChange={(e) => handleChange(key as keyof UserInfoFull, e.target.value)}
                className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                  ? "border-blue-500"
                  : "border-gray-300 bg-gray-100"
                  }`}
              />
            </div>
          ))}

        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">

          <button
            className={`px-4 py-2 rounded text-white ${isForbidden
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={saving || isForbidden}
            onClick={async () => {
              if (isForbidden) return;
              if (isEditing && !saving) await saveUserChanges();
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
          </button>

          {isEditing && !isForbidden && (
            <button
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

          <button
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"            
            onClick={() => navigate(`${ADMIN_URL.KYC}/${user.id}`)}
          >
            KYC
          </button>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
