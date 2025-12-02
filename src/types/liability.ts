export type Liability = {    
    type: "Personal Loan" | "Real Estate Loan" | "Others";
    amount: number;
};

export type Liabilities = Liability[];