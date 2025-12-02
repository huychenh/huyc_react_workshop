export type Phone = {
    number: string;
    type: "Work" | "Personal";
    preferred: boolean;
};

export type Phones = Phone[];