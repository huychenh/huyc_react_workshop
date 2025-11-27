import type { UserInfo } from "./user-info";

export type UserInfoFull = UserInfo & {
  phone?: string;
  birthDate?: string;
  address?: {
    address?: string;
    city?: string;
    postalCode?: string;
    state?: string;
  };
  company?: {
    name?: string;
    title?: string;
    department?: string;
  };
};
