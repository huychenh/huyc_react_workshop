import type { Addresses } from "./address";
import type { Assets } from "./asset";
import type { Emails } from "./email";
import type { IdentificationDocuments } from "./identification-document";
import type { Incomes } from "./income";
import type { InvestmentExperiences } from "./investment-experience";
import type { Liabilities } from "./liability";
import type { NetWorths } from "./net-worth";
import type { Occupations } from "./occupation";
import type { Phones } from "./phone";
import type { SourceWealths } from "./source-wealth";
import type { UserInfo } from "./user-info";
import type { UserInfoFull } from "./user-info-full";

export type KYCInfo = UserInfoFull & UserInfo & {
  middleName?: string;
  age?: string;  
  addresses?: Addresses;
  emails?: Emails;
  phones?: Phones;
  identificationDocuments?: IdentificationDocuments;
  occupations?: Occupations;
  incomes?: Incomes;
  assets?: Assets;
  liabilities?: Liabilities;
  sourceWealths?: SourceWealths;
  netWorths?: NetWorths;
  investmentExperiences?: InvestmentExperiences;  
};