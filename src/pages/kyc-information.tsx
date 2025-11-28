import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL_GET_USER_BY_ID, API_URL_UPDATE_USER } from "../constant/url";
import type { KYCInfo } from "../types/kyc-info";
import type { Address } from "../types/address";

const normalizeKYC = (data: any): KYCInfo => {
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

        // Company
        organization: data.company?.name || "",
        role: data.company?.title || "",
        department: data.company?.department || "",
    };
};

const KYCInformation = () => {
    const { id } = useParams();

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isForbidden = storedUser.role === "officer" && storedUser.id !== Number(id);

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

    const handleAddressChange = (index: number, key: keyof Address, value: string) => {
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
        return <div className="p-6 text-center text-lg font-medium">Loading user information...</div>;

    if (error || !kycInfo)
        return <div className="p-6 text-center text-red-500 text-lg font-medium">{error || "User not found"}</div>;

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
                        {[
                            ["First Name", "firstName"],
                            ["Last Name", "lastName"],
                            ["Middle Name", "middleName"],
                            ["Birthday", "birthday"],
                            ["Age", "age"],
                        ].map(([label, key]) => (
                            <div key={label}>
                                <label className="block text-gray-600">{label}</label>
                                <input
                                    type="text"
                                    value={kycInfo[key as keyof Omit<KYCInfo, 'addresses'>] || ""}
                                    readOnly={!isEditing || isForbidden}
                                    onChange={(e) => handleChange(key as keyof KYCInfo, e.target.value)}
                                    className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden ? "border-blue-500" : "border-gray-300 bg-gray-100"
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                {kycInfo.addresses && kycInfo.addresses.length > 0 && kycInfo.addresses.map((addr, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 mb-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Contact Information
                        </h2>

                        {/* Group header like Windows Form */}
                        <fieldset
                            key={index}
                            className="border border-gray-400 rounded-md p-4 mb-6"
                        >
                            <legend className="text-sm font-semibold px-2">
                                {(kycInfo.addresses?.length ?? 0) > 1 ? `Address ${index + 1}` : "Address"}
                            </legend>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                {[
                                    ["Country", "country"],
                                    ["City", "city"],
                                    ["Street", "street"],
                                    ["Postal Code", "postalCode"],
                                ].map(([label, key]) => (
                                    <div key={label}>
                                        <label className="block text-gray-600">{label}</label>
                                        <input
                                            type="text"
                                            value={addr[key as keyof Address] || ""}
                                            readOnly={!isEditing || isForbidden}
                                            onChange={(e) => handleAddressChange(index, key as keyof Address, e.target.value)}
                                            className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden ? "border-blue-500" : "border-gray-300 bg-gray-100"
                                                }`}
                                        />
                                    </div>
                                ))}

                                {/* Enum Type */}
                                <div>
                                    <label className="block text-gray-600">Type</label>
                                    <select
                                        value={addr.type}
                                        disabled={!isEditing || isForbidden}
                                        onChange={(e) => handleAddressChange(index, "type", e.target.value)}
                                        className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden ? "border-blue-500" : "border-gray-300 bg-gray-100"
                                            }`}
                                    >
                                        <option value="Mailing">Mailing</option>
                                        <option value="Work">Work</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                    </div>
                ))}

                {/* Buttons */}
                <div className="mt-6 flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded text-white ${isForbidden ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
