export type SourceWealth = {    
    type: "Inheritance" | "Donation";
    amount: number;
};

export type SourceWealths = SourceWealth[];