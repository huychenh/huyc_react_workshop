import HttpInstance from "../http";

export type LoginParams = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

export const login = async (params: LoginParams) => {
  return await HttpInstance.post<LoginResponse>("/auth/login", params);
};
