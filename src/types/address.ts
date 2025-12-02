export type Address = {
    country: string;
    city: string;
    street: string;
    postalCode?: string;
    type: "Mailing" | "Work";
};

export type Addresses = Address[];