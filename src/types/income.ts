export type Income = {    
    type: "Salary" | "Investment" | "Others";
    amount: number;
};

export type Incomes = Income[];