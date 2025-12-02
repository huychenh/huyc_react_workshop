export type InvestmentExperience = {    
    experience: "< 5 years" | "> 5 years and < 10 years" | "> 10 years";
    riskTolerance: "10%" | "30%" | "All-in";
};

export type InvestmentExperiences = InvestmentExperience[];