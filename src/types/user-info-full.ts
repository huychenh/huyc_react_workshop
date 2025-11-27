import type { UserInfo } from "./user-info";

export type UserInfoFull = UserInfo & {
  // ===== BASIC INFORMATION =====
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: string;
  age?: number;

  // ===== CONTACT INFORMATION =====
  phones?: {
    number: string;
    type: "Work" | "Personal";
    preferred: boolean;
  }[];

  emails?: {
    email: string;
    type: "Work" | "Personal";
    preferred: boolean;
  }[];

  addresses?: {
    country: string;
    city: string;
    street: string;
    postalCode?: string;
    type: "Mailing" | "Work";
  }[];

  // ===== COMPANY INFORMATION =====
  company?: {
    name?: string;
    title?: string;
    department?: string;
  };

  // ===== IDENTIFICATION INFORMATION =====
  identification?: {
    passport?: File;
    nationalId?: File;
    driverLicense?: File;
  };

  // ===== OCCUPATION & EMPLOYMENT INFORMATION =====
  employmentHistory?: {
    name: string;         // required
    fromYear: number;     // required, YYYY
    toYear?: number;      // optional, must be > fromYear (validate separately)
  }[];
};
