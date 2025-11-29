import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL_GET_USER_BY_ID, API_URL_UPDATE_USER } from "../constant/url";
import type { KYCInfo } from "../types/kyc-info";
import type { Address } from "../types/address";
import type { Email, Emails } from "../types/email";

const normalizeKYC = (data: any): KYCInfo => {
  //Addresses
  const addresses: Address[] = [];

  if (data.address) {
    addresses.push({
      country: data.address.country || "",
      city: data.address.city || "",
      street: data.address.street || data.address.address || "",
      postalCode: data.address.zipCode || data.address.postalCode || "",
      type: "Mailing", // default type
    });
  }

  //Emails
  const emails: Emails = [];
  if (data.email) {
    emails.push({
      email: data.email,
      type: "Personal", // default type
      preferred: true, // default preferred
    });
  }

  return {
    id: data.id,
    username: data.username || "",

    // Name
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    middleName: data.middleName || "",
    age: data.age?.toString() || "",

    // Basic
    email: data.email || "",
    gender: data.gender || "",
    avatar: data.image || "",
    phoneNumber: data.phone || "",
    birthday: data.birthDate || "",

    // Addresses
    addresses,

    //emails
    emails,

    // Company
    organization: data.company?.name || "",
    role: data.company?.title || "",
    department: data.company?.department || "",
  };
};

// Basic info (text inputs)
const basicFields: Array<
  [string, keyof Omit<KYCInfo, "addresses" | "emails">]
> = [
  ["First Name", "firstName"],
  ["Last Name", "lastName"],
  ["Middle Name", "middleName"],
  ["Birthday", "birthday"],
  ["Age", "age"],
];

// Addresses
const addressFields: Array<[string, keyof Address]> = [
  ["Country", "country"],
  ["City", "city"],
  ["Street", "street"],
  ["Postal Code", "postalCode"],
];

// Emails
const emailFields: Array<[string, keyof Email]> = [
  ["Email Address", "email"],
  ["Type", "type"],
  ["Preferred", "preferred"],
];

const KYCInformation = () => {
  const { id } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isForbidden =
    storedUser.role === "officer" && storedUser.id !== Number(id);

  const [kycInfo, setKycInfo] = useState<KYCInfo | null>(null);
  const [originalKycInfo, setOriginalKycInfo] = useState<KYCInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch KYC info
  useEffect(() => {
    const fetchKYC = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL_GET_USER_BY_ID(Number(id)));
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        const normalized = normalizeKYC(data);

        setKycInfo(normalized);
        setOriginalKycInfo(normalized);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchKYC();
  }, [id]);

  const handleChange = (key: keyof KYCInfo, value: string) => {
    if (!kycInfo) return;
    setKycInfo({ ...kycInfo, [key]: value });
  };

  const handleAddressChange = (
    index: number,
    key: keyof Address,
    value: string
  ) => {
    if (!kycInfo?.addresses) return;
    const newAddresses = [...kycInfo.addresses];
    newAddresses[index] = { ...newAddresses[index], [key]: value };
    setKycInfo({ ...kycInfo, addresses: newAddresses });
  };

  const saveKYCChanges = async () => {
    if (!kycInfo) return;
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const res = await fetch(API_URL_UPDATE_USER(Number(id)), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kycInfo),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const data = await res.json();
      const normalized = normalizeKYC(data);

      setKycInfo(normalized);
      setOriginalKycInfo(normalized);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!originalKycInfo) return;
    setKycInfo(originalKycInfo);
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-medium">
        Loading user information...
      </div>
    );

  if (error || !kycInfo)
    return (
      <div className="p-6 text-center text-red-500 text-lg font-medium">
        {error || "User not found"}
      </div>
    );

  //Function Add Address
  const MAX_ADDRESSES = 3;

  const handleAddAddress = () => {
    if (!isEditing || isForbidden) return;

    if ((kycInfo?.addresses?.length ?? 0) >= MAX_ADDRESSES) {
      return;
    }

    const newAddress: Address = {
      country: "",
      city: "",
      street: "",
      postalCode: "",
      type: "Mailing",
    };

    setKycInfo((prev) => {
      const base = prev ?? ({} as KYCInfo);
      return {
        ...base,
        addresses: [...(base.addresses ?? []), newAddress],
      };
    });
  };
  //

  //Function Remove Address
  const handleRemoveAddress = (index: number) => {
    setKycInfo((prev) => {
      if (!prev) return prev;

      const updatedAddresses = [...(prev.addresses ?? [])];
      updatedAddresses.splice(index, 1);

      return { ...prev, addresses: updatedAddresses };
    });
  };
  //

  //Function Add Email
  const MAX_EMAILS = 3;

  const handleAddEmail = () => {
    if (!isEditing || isForbidden) return;

    setKycInfo((prev) => {
      const base = prev ?? ({} as KYCInfo);
      const currentEmails = base.emails ?? [];

      if (currentEmails.length >= MAX_EMAILS) return base;

      const newEmail: Email = {
        email: "",
        type: "Personal", // default type
        preferred: true, // default preferred
      };

      return {
        ...base,
        emails: [...currentEmails, newEmail],
      };
    });
  };

  //

  //Function handleEmailChange
  const handleEmailChange = (
    index: number,
    key: keyof Email,
    value: string | boolean
  ) => {
    setKycInfo((prev) => {
      if (!prev?.emails) return prev;

      const updatedEmails = [...prev.emails];
      updatedEmails[index] = { ...updatedEmails[index], [key]: value };
      return { ...prev, emails: updatedEmails };
    });
  };
  //

  //Function handleRemoveEmail
  const handleRemoveEmail = (index: number) => {
    setKycInfo((prev) => {
      if (!prev?.emails) return prev;

      const updatedEmails = [...prev.emails];
      updatedEmails.splice(index, 1);

      return { ...prev, emails: updatedEmails };
    });
  };
  //

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-full bg-white rounded-lg shadow-md p-6">
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-center">
            {successMessage}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Financial Status</h1>

        {/* Basic Information */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {basicFields.map(([label, key]) => (
              <div key={label}>
                <label className="block text-gray-600">{label}</label>
                <input
                  type="text"
                  value={kycInfo[key] || ""}
                  readOnly={!isEditing || isForbidden}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`mt-1 w-full border px-2 py-1 rounded ${
                    isEditing && !isForbidden
                      ? "border-blue-500"
                      : "border-gray-300 bg-gray-100"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>

          {/* Address Area   */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Addresses</h3>

            {/* Map addresses */}
            {kycInfo.addresses?.map((addr, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Address #${index + 1}`}</span> &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Address
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {addressFields.map(([label, key]) => (
                    <div key={label}>
                      <label className="block text-gray-600">{label}</label>
                      <input
                        type="text"
                        value={addr[key] || ""}
                        readOnly={!isEditing || isForbidden}
                        onChange={(e) =>
                          handleAddressChange(index, key, e.target.value)
                        }
                        className={`mt-1 w-full border px-2 py-1 rounded ${
                          isEditing && !isForbidden
                            ? "border-blue-500"
                            : "border-gray-300 bg-gray-100"
                        }`}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-gray-600">Type</label>
                    <select
                      value={addr.type}
                      disabled={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleAddressChange(index, "type", e.target.value)
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${
                        isEditing && !isForbidden
                          ? "border-blue-500"
                          : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      <option value="Mailing">Mailing</option>
                      <option value="Work">Work</option>
                    </select>
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Button add Address */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddAddress}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.addresses?.length ?? 0) >= MAX_ADDRESSES
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Address
              </button>
            </div>
          </div>
          {/* End Address Area   */}

          {/* Emails Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Emails</h3>

            {/* Map emails */}
            {kycInfo.emails?.map((email, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Email #${index + 1}`}</span> &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Email
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {emailFields.map(([label, key]) => (
                    <div key={label}>
                      <label className="block text-gray-600">{label}</label>

                      {key === "email" && (
                        <input
                          type="email"
                          value={email.email || ""}
                          readOnly={!isEditing || isForbidden}
                          onChange={(e) =>
                            handleEmailChange(index, "email", e.target.value)
                          }
                          className={`mt-1 w-full border px-2 py-1 rounded ${
                            isEditing && !isForbidden
                              ? "border-blue-500"
                              : "border-gray-300 bg-gray-100"
                          }`}
                        />
                      )}

                      {key === "type" && (
                        <select
                          value={email.type}
                          disabled={!isEditing || isForbidden}
                          onChange={(e) =>
                            handleEmailChange(
                              index,
                              "type",
                              e.target.value as "Work" | "Personal"
                            )
                          }
                          className={`mt-1 w-full border px-2 py-1 rounded ${
                            isEditing && !isForbidden
                              ? "border-blue-500"
                              : "border-gray-300 bg-gray-100"
                          }`}
                        >
                          <option value="Personal">Personal</option>
                          <option value="Work">Work</option>
                        </select>
                      )}

                      {key === "preferred" && (
                        <select
                          value={email.preferred ? "Yes" : "No"}
                          disabled={!isEditing || isForbidden}
                          onChange={(e) =>
                            handleEmailChange(
                              index,
                              "preferred",
                              e.target.value === "Yes"
                            )
                          }
                          className={`mt-1 w-full border px-2 py-1 rounded ${
                            isEditing && !isForbidden
                              ? "border-blue-500"
                              : "border-gray-300 bg-gray-100"
                          }`}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}

            {/* Button Add Email */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddEmail}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.emails?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Email
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded text-white ${
              isForbidden
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={saving || isForbidden}
            onClick={async () => {
              if (isForbidden) return;
              if (isEditing && !saving) await saveKYCChanges();
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
        </div>
      </div>
    </div>
  );
};

export default KYCInformation;
