import type { Addresses } from "./address";
import type { Emails } from "./email";
import type { IdentificationDocuments } from "./identification-document";
import type { Phones } from "./phone";
import type { UserInfo } from "./user-info";
import type { UserInfoFull } from "./user-info-full";

export type KYCInfo = UserInfoFull & UserInfo & {
  middleName?: string;
  age?: string;  
  addresses?: Addresses;
  emails?: Emails;
  phones?: Phones;
  identificationDocuments?: IdentificationDocuments;
};