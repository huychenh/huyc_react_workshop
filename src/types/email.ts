export type Email = {
    email: string;
    type: "Work" | "Personal";
    preferred: boolean;
};

export type Emails = Email[];