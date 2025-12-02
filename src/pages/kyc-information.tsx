import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL_GET_USER_BY_ID, API_URL_UPDATE_USER } from "../constant/url";
import type { KYCInfo } from "../types/kyc-info";
import type { Address } from "../types/address";
import type { Email } from "../types/email";
import type { Phone } from "../types/phone";
import type {
  IdentificationDocument,
} from "../types/identification-document";
import type { Occupation } from "../types/occupation";
import type { Income } from "../types/income";
import type { Asset } from "../types/asset";
import type { Liability } from "../types/liability";
import type { SourceWealth } from "../types/source-wealth";
import type { InvestmentExperience } from "../types/investment-experience";
import { addressFields, basicFields, emailFields, LIABILITY_TYPES, normalizeKYC, phoneFields, SOURCE_WEALTH_TYPES } from "../utils/normalize-kyc";

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
  const [errors, setErrors] = useState<Record<string, boolean>>({});

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

  const saveKYCChanges = async (): Promise<boolean> => {
    if (!kycInfo) return false;

    const newErrors: Record<string, boolean> = {};
    const requiredFields: Array<keyof KYCInfo> = ["firstName", "lastName", "birthday"];
    requiredFields.forEach((key) => {
      if (!kycInfo[key] || kycInfo[key].toString().trim() === "") {
        newErrors[key] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError("Please fill all required fields.");
      return false; // validation fail
    }

    try {
      setErrors({});
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

      return true; // save thành công
    } catch (err: any) {
      setError(err.message || "Error updating user");
      return false;
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

  // if (error || !kycInfo)
  //   return (
  //     <div className="p-6 text-center text-red-500 text-lg font-medium">
  //       {error || "User not found"}
  //     </div>
  //   );

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

  //Function handleAddPhone
  const handleAddPhone = () => {
    if (!isEditing || isForbidden) return;

    const newPhone: Phone = {
      number: "",
      type: "Personal",
      preferred: false,
    };

    setKycInfo((prev) => {
      const base = prev ?? ({} as KYCInfo);
      const currentPhones = base.phones ?? [];

      if (currentPhones.length >= 3) return base; // max 3 phones

      return {
        ...base,
        phones: [...currentPhones, newPhone],
      };
    });
  };
  //

  //Function handlePhoneChange
  const handlePhoneChange = (
    index: number,
    key: keyof Phone,
    value: string | boolean
  ) => {
    if (!kycInfo?.phones) return;

    const newPhones = [...kycInfo.phones];
    newPhones[index] = { ...newPhones[index], [key]: value };
    setKycInfo({ ...kycInfo, phones: newPhones });
  };
  //

  //Function handleRemovePhone
  const handleRemovePhone = (index: number) => {
    if (!kycInfo?.phones) return;

    const updatedPhones = [...kycInfo.phones];
    updatedPhones.splice(index, 1);

    setKycInfo({ ...kycInfo, phones: updatedPhones });
  };
  //

  //Function handleAddDocument
  const handleAddDocument = () => {
    if (!isEditing || isForbidden) return;

    const newDoc: IdentificationDocument = {
      type: "Passport", // default type
      document: "",
      expiryDate: "",
    };

    setKycInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        identificationDocuments: [
          ...(prev.identificationDocuments ?? []),
          newDoc,
        ],
      };
    });
  };
  //

  //Function handleDocumentChange
  const handleDocumentChange = (
    index: number,
    key: keyof IdentificationDocument,
    value: string | File
  ) => {
    if (!kycInfo?.identificationDocuments) return;
    const updatedDocs = [...kycInfo.identificationDocuments];
    updatedDocs[index] = { ...updatedDocs[index], [key]: value };
    setKycInfo({ ...kycInfo, identificationDocuments: updatedDocs });
  };
  //

  // Function handleRemoveDocument
  const handleRemoveDocument = (index: number) => {
    if (!kycInfo?.identificationDocuments) return;

    const updatedDocs = [...kycInfo.identificationDocuments];
    updatedDocs.splice(index, 1); // xoá document ở vị trí index

    setKycInfo({ ...kycInfo, identificationDocuments: updatedDocs });
  };
  //

  //Function handleRemoveOccupation
  const handleRemoveOccupation = (index: number) => {
    //
    if (!kycInfo?.occupations) return;

    const updatedOccupations = [...kycInfo.occupations];
    updatedOccupations.splice(index, 1);
    setKycInfo({ ...kycInfo, occupations: updatedOccupations });
    //
  };
  //

  //Function handleOccupationChange
  const handleOccupationChange = (
    index: number,
    key: keyof Occupation,
    value: string
  ) => {
    if (!kycInfo?.occupations) return;

    const updated = [...kycInfo.occupations];
    updated[index] = { ...updated[index], [key]: value };

    setKycInfo({ ...kycInfo, occupations: updated });
  };
  //

  //Function handleAddOccupation
  const handleAddOccupation = () => {
    if (!isEditing || isForbidden) return;

    const newOccupation: Occupation = {
      name: "",
      fromDate: "",
      toDate: "",
    };

    setKycInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        occupations: [...(prev.occupations ?? []), newOccupation],
      };
    });
  };
  //

  //Function handleAddIncome
  const handleAddIncome = () => {
    if (!isEditing || isForbidden) return;

    const newIncome: Income = {
      type: "Salary", // default value
      amount: 0,
    };

    setKycInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        incomes: [...(prev.incomes ?? []), newIncome],
      };
    });
  };
  //

  //Function handleIncomeChange
  const handleIncomeChange = (
    index: number,
    key: keyof Income,
    value: string
  ) => {
    if (!kycInfo?.incomes) return;

    const updated = [...kycInfo.incomes];

    updated[index] = {
      ...updated[index],
      [key]: key === "amount" ? Number(value) : value,
    };

    setKycInfo({ ...kycInfo, incomes: updated });
  };
  //

  //Function handleRemoveIncome
  const handleRemoveIncome = (index: number) => {
    if (!kycInfo?.incomes) return;

    const updatedIncomes = [...kycInfo.incomes];
    updatedIncomes.splice(index, 1);

    setKycInfo({ ...kycInfo, incomes: updatedIncomes });
  };
  //

  //Function handleAddAsset
  const handleAddAsset = () => {
    if (!isEditing || isForbidden) return;

    const newAsset: Asset = {
      type: "Bond", // default value
      amount: 0,
    };

    setKycInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        assets: [...(prev.assets ?? []), newAsset],
      };
    });
  };
  //

  //Function handleRemoveAsset
  const handleRemoveAsset = (index: number) => {
    if (!kycInfo?.assets) return;

    const updatedAssets = [...kycInfo.assets];
    updatedAssets.splice(index, 1);

    setKycInfo({ ...kycInfo, assets: updatedAssets });
  };
  //

  //Function handleAssetChange
  const handleAssetChange = (
    index: number,
    key: keyof Asset,
    value: string
  ) => {
    if (!kycInfo?.assets) return;

    const updated = [...kycInfo.assets];

    updated[index] = {
      ...updated[index],
      [key]: key === "amount" ? Number(value) : value,
    };

    setKycInfo({ ...kycInfo, assets: updated });
  };
  //

  //Function handleAddLiability
  const handleAddLiability = () => {
    if (!isEditing || isForbidden) return;

    const newLiability: Liability = {
      type: "Personal Loan", // default value
      amount: 0,
    };

    setKycInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        liabilities: [...(prev.liabilities ?? []), newLiability],
      };
    });
  };
  //

  //Function handleRemoveLiability
  const handleRemoveLiability = (index: number) => {
    if (!kycInfo?.liabilities) return;

    const updatedLiabilities = [...kycInfo.liabilities];
    updatedLiabilities.splice(index, 1);

    setKycInfo({ ...kycInfo, liabilities: updatedLiabilities });
  };
  //

  //Function handleLiabilityChange
  const handleLiabilityChange = (
    index: number,
    key: keyof Liability,
    value: string
  ) => {
    if (!kycInfo?.liabilities) return;

    const updated = [...kycInfo.liabilities];

    updated[index] = {
      ...updated[index],
      [key]: key === "amount" ? Number(value) : value,
    };

    setKycInfo({ ...kycInfo, liabilities: updated });
  };
  //

  //
  const totalLiabilities = kycInfo?.liabilities?.reduce(
    (sum, liab) => sum + (Number(liab.amount) || 0),
    0
  );
  //

  //Function handleAddSourceWealth
  const handleAddSourceWealth = () => {
    if (!isEditing || isForbidden) return;

    const newSource: SourceWealth = {
      type: "Inheritance",
      amount: 0,
    };

    setKycInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sourceWealths: [...(prev.sourceWealths ?? []), newSource],
      };
    });
  };

  //
  const totalSourceWealths = kycInfo?.sourceWealths?.reduce(
    (sum, source) => sum + (Number(source.amount) || 0),
    0
  );

  //

  //Function handleSourceWealthChange
  const handleSourceWealthChange = (
    index: number,
    key: keyof SourceWealth,
    value: string
  ) => {
    if (!kycInfo?.sourceWealths) return;

    const updated = [...kycInfo.sourceWealths];

    updated[index] = {
      ...updated[index],
      [key]: key === "amount" ? Number(value) : value,
    };

    setKycInfo({ ...kycInfo, sourceWealths: updated });
  };
  //

  //Function handleRemoveSourceWealth
  const handleRemoveSourceWealth = (index: number) => {
    if (!kycInfo?.sourceWealths) return;

    const updatedSources = [...kycInfo.sourceWealths];
    updatedSources.splice(index, 1);

    setKycInfo({
      ...kycInfo,
      sourceWealths: updatedSources,
    });
  };
  //

  //totalNetWorths
  const totalIncomes =
    kycInfo?.incomes?.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0) ??
    0;
  const totalAssets =
    kycInfo?.assets?.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0) ??
    0;
  const totalNetWorths =
    (totalIncomes ?? 0) +
    (totalAssets ?? 0) +
    (totalLiabilities ?? 0) +
    (totalSourceWealths ?? 0);
  //

  //Function handleInvestmentChange
  const handleInvestmentChange = (
    index: number,
    key: keyof InvestmentExperience,
    value: InvestmentExperience[keyof InvestmentExperience]
  ) => {
    if (!kycInfo?.investmentExperiences) return;

    const updated = [...kycInfo.investmentExperiences];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    setKycInfo({ ...kycInfo, investmentExperiences: updated });
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

        {error && (
          <div className="mb-4 text-red-500 font-bold text-center">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          {Object.entries(errors).length > 0 && (
            <div className="mb-4">
              {Object.entries(errors).map(([key, message]) => (
                <p key={key} className="text-red-500 font-bold text-center mt-1">
                  {message}
                </p>
              ))}
            </div>
          )}


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {basicFields.map(([label, key, required]) => (
              <div key={label}>
                <label className="block text-gray-600">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>

                <input
                  type="text"
                  value={kycInfo?.[key] || ""}
                  readOnly={!isEditing || isForbidden}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`mt-1 w-full border px-2 py-1 rounded ${errors[key]
                    ? "border-red-500 bg-red-100"
                    : isEditing && !isForbidden
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
            {kycInfo?.addresses?.map((addr, index) => (
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
                        className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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
            {kycInfo?.emails?.map((email, index) => (
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
                          className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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
                          className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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
                          className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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

          {/* Phones Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Phones</h3>

            {/* Map phones */}
            {kycInfo?.phones?.map((phone, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Phone #${index + 1}`}</span> &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Phone
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {phoneFields.map(([label, key]) => (
                    <div key={label}>
                      <label className="block text-gray-600">{label}</label>

                      {key === "number" && (
                        <input
                          type="tel"
                          value={phone.number || ""}
                          readOnly={!isEditing || isForbidden}
                          onChange={(e) =>
                            handlePhoneChange(index, "number", e.target.value)
                          }
                          className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                            ? "border-blue-500"
                            : "border-gray-300 bg-gray-100"
                            }`}
                        />
                      )}

                      {key === "type" && (
                        <select
                          value={phone.type}
                          disabled={!isEditing || isForbidden}
                          onChange={(e) =>
                            handlePhoneChange(
                              index,
                              "type",
                              e.target.value as "Work" | "Personal"
                            )
                          }
                          className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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
                          value={phone.preferred ? "Yes" : "No"}
                          disabled={!isEditing || isForbidden}
                          onChange={(e) =>
                            handlePhoneChange(
                              index,
                              "preferred",
                              e.target.value === "Yes"
                            )
                          }
                          className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
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

            {/* Button Add Phone */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddPhone}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.phones?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Phone
              </button>
            </div>
          </div>

          {/* Identification Documents Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">
              Identification Documents
            </h3>

            {/* Map documents */}
            {kycInfo?.identificationDocuments?.map((doc, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Document #${index + 1}`}</span> &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Document
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Document Type */}
                  <div>
                    <label className="block text-gray-600">Type</label>
                    <select
                      value={doc.type}
                      disabled={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleDocumentChange(
                          index,
                          "type",
                          e.target.value as
                          | "Passport"
                          | "National ID Card"
                          | "Driver's License"
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      <option value="Passport">Passport</option>
                      <option value="National ID Card">National ID Card</option>
                      <option value="Driver's License">Driver's License</option>
                    </select>
                  </div>

                  {/* Upload Document */}
                  <div>
                    <label className="block text-gray-600 mb-1">
                      Upload Document
                    </label>
                    <div className="flex items-center gap-2">
                      <label
                        className={`
                                     px-4 py-1
    bg-gradient-to-r from-amber-700 to-amber-800 
    text-white rounded-lg cursor-pointer 
    hover:bg-amber-900 
    disabled:opacity-50
    inline-flex items-center 
    h-9
                                  `}
                      >
                        Choose File
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={!isEditing || isForbidden}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            handleDocumentChange(index, "document", file);
                          }}
                          className="hidden"
                        />
                      </label>

                      <span className="text-gray-700 truncate max-w-xs">
                        {doc.document
                          ? typeof doc.document === "string"
                            ? doc.document
                            : doc.document.name
                          : "No file chosen"}
                      </span>
                    </div>

                    {doc.document && typeof doc.document !== "string" && (
                      <p className="mt-1 text-sm text-gray-600">
                        {doc.document.name}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-gray-600">Expiry Date</label>
                    <input
                      type="date"
                      value={doc.expiryDate || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleDocumentChange(
                          index,
                          "expiryDate",
                          e.target.value
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Button Add Document */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddDocument}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.identificationDocuments?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Identification Document
              </button>
            </div>
          </div>

          {/* Occupations Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Occupations</h3>

            {/* Map occupations */}
            {kycInfo?.occupations?.map((occ, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Occupation #${index + 1}`}</span>
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveOccupation(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Occupation
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-600">Name</label>
                    <input
                      type="text"
                      value={occ.name || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleOccupationChange(index, "name", e.target.value)
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>

                  {/* From Date */}
                  <div>
                    <label className="block text-gray-600">From Date</label>
                    <input
                      type="date"
                      value={occ.fromDate || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleOccupationChange(
                          index,
                          "fromDate",
                          e.target.value
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>

                  {/* To Date */}
                  <div>
                    <label className="block text-gray-600">To Date</label>
                    <input
                      type="date"
                      value={occ.toDate || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleOccupationChange(index, "toDate", e.target.value)
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Add Occupation Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddOccupation}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.occupations?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Occupation
              </button>
            </div>
          </div>

          {/* Incomes (A) Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Incomes (A)</h3>

            {/* Map incomes */}
            {kycInfo?.incomes?.map((inc, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Income #${index + 1}`}</span>
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveIncome(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Income
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Type (ComboBox) */}
                  <div>
                    <label className="block text-gray-600">Type</label>
                    <select
                      value={inc.type}
                      disabled={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleIncomeChange(
                          index,
                          "type",
                          e.target.value as "Salary" | "Investment" | "Others"
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      <option value="Salary">Salary</option>
                      <option value="Investment">Investment</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-gray-600">
                      Amount (Currency)
                    </label>
                    <input
                      type="number"
                      value={inc.amount || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleIncomeChange(index, "amount", e.target.value)
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Add Income Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddIncome}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.incomes?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Income
              </button>
            </div>
          </div>

          {/* Assets (B) Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Assets (B)</h3>

            {/* Map assets */}
            {kycInfo?.assets?.map((asset, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Asset #${index + 1}`}</span>
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Asset
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Type (ComboBox) */}
                  <div>
                    <label className="block text-gray-600">Type</label>
                    <select
                      value={asset.type}
                      disabled={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleAssetChange(
                          index,
                          "type",
                          e.target.value as
                          | "Cash"
                          | "Property"
                          | "Investment"
                          | "Others"
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Property">Property</option>
                      <option value="Investment">Investment</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-gray-600">
                      Amount (Currency)
                    </label>
                    <input
                      type="number"
                      value={asset.amount || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleAssetChange(index, "amount", e.target.value)
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Add Asset Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddAsset}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.assets?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Asset
              </button>
            </div>
          </div>

          {/* Liabilities (C) Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Liabilities (C)</h3>
            <span>
              Liabilities are any outstanding debts or obligations you may have.
              These can include loans such as personal loans, mortgages, or
              other forms of debt.
            </span>
            {/* Map liabilities */}
            {kycInfo?.liabilities?.map((liab, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Income #${index + 1}`}</span>
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveLiability(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Income
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Type (ComboBox) */}
                  <div>
                    <label className="block text-gray-600">Type</label>
                    <select
                      value={liab.type}
                      disabled={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleLiabilityChange(
                          index,
                          "type",
                          e.target.value as Liability["type"]
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      {LIABILITY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-gray-600">
                      Amount (Currency)
                    </label>
                    <input
                      type="number"
                      value={liab.amount || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleLiabilityChange(index, "amount", e.target.value)
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Total Liabilities */}
            <div className="mt-4 mb-2">
              <label className="block text-gray-600 font-semibold">
                Total Liabilities
              </label>
              <input
                type="number"
                value={totalLiabilities}
                disabled
                className="mt-1 w-full border px-2 py-1 rounded bg-gray-100 border-gray-300"
              />
            </div>

            {/* Add Liability Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddLiability}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.liabilities?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Liability
              </button>
            </div>
          </div>

          {/* Source of Wealth (D) Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Source of Wealth (D)</h3>
            <span>
              This section identifies the origin of your wealth, such as any
              inheritance or donations you may have received. It's important for
              financial transparency.
            </span>

            {/* Map source of wealth */}
            {kycInfo?.sourceWealths?.map((source, index) => (
              <fieldset
                key={index}
                className="border border-gray-400 rounded-md p-4 mb-4"
              >
                <legend className="text-sm font-semibold px-2 flex items-center justify-between">
                  <span>{`Income #${index + 1}`}</span>
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveSourceWealth(index)}
                    disabled={!isEditing || isForbidden}
                    className="relative text-red-500 hover:text-red-700 disabled:opacity-50 group cursor-pointer"
                  >
                    ✕
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Remove Income
                    </span>
                  </button>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Type */}
                  <div>
                    <label className="block text-gray-600">Type</label>
                    <select
                      value={source.type}
                      disabled={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleSourceWealthChange(
                          index,
                          "type",
                          e.target.value as SourceWealth["type"]
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      {SOURCE_WEALTH_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-gray-600">
                      Amount (Currency)
                    </label>
                    <input
                      type="number"
                      value={source.amount || ""}
                      readOnly={!isEditing || isForbidden}
                      onChange={(e) =>
                        handleSourceWealthChange(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                      className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                        ? "border-blue-500"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

            {/* Total Source of Wealth */}
            <div className="mt-4 mb-2">
              <label className="block text-gray-600 font-semibold">
                Total Source of Wealth
              </label>
              <input
                type="number"
                value={totalSourceWealths}
                disabled
                className="mt-1 w-full border px-2 py-1 rounded bg-gray-100 border-gray-300"
              />
            </div>

            {/* Add Source Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddSourceWealth}
                disabled={
                  !isEditing ||
                  isForbidden ||
                  (kycInfo?.sourceWealths?.length ?? 0) >= 3
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Wealth of Source
              </button>
            </div>
          </div>

          {/* Net Worth Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">Net Worth</h3>
            <div className="mt-4 mb-2">
              <label className="block text-gray-600 font-semibold">Total</label>
              <input
                type="number"
                value={totalNetWorths}
                disabled
                className="mt-1 w-full border px-2 py-1 rounded bg-gray-100 border-gray-300"
              />
            </div>
          </div>

          {/* Investment Experience Area */}
          <div className="border border-gray-400 rounded-md p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">
              Investment Experience and Objectives
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {/* Experience in Financial Markets */}
              <div>
                <label className="block text-gray-600">
                  Experience in Financial Markets
                </label>
                <select
                  value={kycInfo?.investmentExperiences?.[0]?.experience || ""}
                  disabled={!isEditing || isForbidden}
                  onChange={(e) =>
                    handleInvestmentChange(
                      0, // index of the item in the array
                      "experience",
                      e.target.value as InvestmentExperience["experience"]
                    )
                  }
                  className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                    ? "border-blue-500"
                    : "border-gray-300 bg-gray-100"
                    }`}
                >
                  <option value="< 5 years">&lt; 5 years</option>
                  <option value="> 5 years and < 10 years">
                    &gt; 5 years and &lt; 10 years
                  </option>
                  <option value="> 10 years">&gt; 10 years</option>
                </select>
              </div>

              {/* Risk Tolerance */}
              <div>
                <label className="block text-gray-600">Risk Tolerance</label>
                <select
                  value={
                    kycInfo?.investmentExperiences?.[0]?.riskTolerance || ""
                  }
                  disabled={!isEditing || isForbidden}
                  onChange={(e) =>
                    handleInvestmentChange(
                      0, // index of the experience in the array
                      "riskTolerance",
                      e.target.value as InvestmentExperience["riskTolerance"]
                    )
                  }
                  className={`mt-1 w-full border px-2 py-1 rounded ${isEditing && !isForbidden
                    ? "border-blue-500"
                    : "border-gray-300 bg-gray-100"
                    }`}
                >
                  <option value="10%">10%</option>
                  <option value="30%">30%</option>
                  <option value="All-in">All-in</option>
                </select>
              </div>
            </div>
          </div>
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
              if (isEditing && !saving) {
                const success = await saveKYCChanges();
                if (success) setIsEditing(false);
              } else {
                setIsEditing(true);
              }
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
