export type IdentificationDocument = {    
    type: "Passport" | "National ID Card" | "Driver's License";
    expiryDate: string;
    document: string;
};

export type IdentificationDocuments = IdentificationDocument[];