export type Asset = {    
    type: "Bond" | "Liquidity" | "Real Estate" | "Others";
    amount: number;
};

export type Assets = Asset[];