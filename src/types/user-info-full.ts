import type { UserInfo } from "./user-info";

export type UserInfoFull = UserInfo & {
  country?: string;
  city?: string;
  address?: string;
  email?: string;  
  phoneNumber?: string;
  birthday?: string;
  organization?: string;
  role?: string;
  department?: string;
  zipCode?: string;  
};
