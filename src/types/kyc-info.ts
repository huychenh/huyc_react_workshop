import type { Addresses } from "./address";
import type { UserInfo } from "./user-info";
import type { UserInfoFull } from "./user-info-full";

export type KYCInfo = UserInfoFull & UserInfo & {
  middleName?: string;
  age?: string;  
  addresses?: Addresses;
};