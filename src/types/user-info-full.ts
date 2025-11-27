import type { UserInfo } from "./user-info";

export type User = UserInfo & {  
  country: string;
  city: string;
  address: string;
  phone: string;
  birthday: string;
  organization: string;
  role: string;
  department: string;
  zip: string;
};
