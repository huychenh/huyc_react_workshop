import type { Address } from "../types/address";
import type { Assets } from "../types/asset";
import type { Email, Emails } from "../types/email";
import type { IdentificationDocuments } from "../types/identification-document";
import type { Incomes } from "../types/income";
import type { KYCInfo } from "../types/kyc-info";
import type { Liability } from "../types/liability";
import type { Occupations } from "../types/occupation";
import type { Phone, Phones } from "../types/phone";
import type { SourceWealth } from "../types/source-wealth";

export const normalizeKYC = (data: any): KYCInfo => {
    //Addresses
    const addresses: Address[] = [];
    if (data.address) {
        addresses.push({
            country: data.address.country || "",
            city: data.address.city || "",
            street: data.address.street || data.address.address || "",
            postalCode: data.address.zipCode || data.address.postalCode || "",
            type: "Mailing",
        });
    }

    //Emails
    const emails: Emails = [];
    if (data.email) {
        emails.push({
            email: data.email,
            type: "Personal",
            preferred: true,
        });
    }

    //Phones
    const phones: Phones = [];
    if (data.phone) {
        phones.push({
            number: data.phone,
            type: "Personal",
            preferred: true,
        });
    }

    //Identification Documents
    const identificationDocuments: IdentificationDocuments = [];
    if (data.identificationDocuments?.length) {
        data.identificationDocuments.forEach((doc: any) => {
            identificationDocuments.push({
                type:
                    doc.type === "Passport" ||
                        doc.type === "National ID Card" ||
                        doc.type === "Driver's License"
                        ? doc.type
                        : "Passport",
                expiryDate: doc.expiryDate || "",
                document: doc.document || "",
            });
        });
    }

    //Occupations
    const occupations: Occupations = [];
    if (data.occupations?.length) {
        data.occupations.forEach((obj: any) => {
            occupations.push({
                name: obj.occupation,
                fromDate: obj.fromDate || "",
                toDate: obj.toDate || "",
            });
        });
    }

    //Incomes
    const incomes: Incomes = [];
    if (data.incomes?.length) {
        data.incomes.forEach((obj: any) => {
            incomes.push({
                type: obj.type,
                amount: obj.amount || "",
            });
        });
    }

    //Assets
    const assets: Assets = [];
    if (data.assets?.length) {
        data.assets.forEach((obj: any) => {
            assets.push({
                type: obj.type,
                amount: obj.amount || "",
            });
        });
    }

    return {
        id: data.id,
        username: data.username || "",

        firstName: data.firstName || "",
        lastName: data.lastName || "",
        middleName: data.middleName || "",
        age: data.age?.toString() || "",

        email: data.email || "",
        gender: data.gender || "",
        image: data.image || "",
        phoneNumber: data.phone || "",
        birthday: data.birthDate || "",

        addresses,
        emails,
        phones,
        identificationDocuments,
        occupations,

        organization: data.company?.name || "",
        role: data.company?.title || "",
        department: data.company?.department || "",
    };
};


export const basicFields: Array<
    [
        string,
        keyof Omit<
            KYCInfo,
            | "addresses"
            | "emails"
            | "phones"
            | "identificationDocuments"
            | "occupations"
            | "incomes"
            | "assets"
            | "liabilities"
            | "sourceWealths"
            | "netWorths"
            | "investmentExperiences"
        >,
        boolean
    ]
> = [
        ["First Name", "firstName", true],
        ["Last Name", "lastName", true],
        ["Middle Name", "middleName", false],
        ["Birthday", "birthday", true],
        ["Age", "age", false],
    ];


// Addresses
export const addressFields: Array<[string, keyof Address]> = [
    ["Country", "country"],
    ["City", "city"],
    ["Street", "street"],
    ["Postal Code", "postalCode"],
];

// Emails
export const emailFields: Array<[string, keyof Email]> = [
    ["Email Address", "email"],
    ["Type", "type"],
    ["Preferred", "preferred"],
];

// Phones
export const phoneFields: Array<[string, keyof Phone]> = [
    ["Phone Number", "number"],
    ["Type", "type"],
    ["Preferred", "preferred"],
];

export const LIABILITY_TYPES: Liability["type"][] = [
    "Personal Loan",
    "Real Estate Loan",
    "Others",
];

export const SOURCE_WEALTH_TYPES: SourceWealth["type"][] = ["Inheritance", "Donation"];