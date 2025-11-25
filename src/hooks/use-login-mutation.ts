import { useMutation } from "@tanstack/react-query";
import { login, type LoginParams } from "../apis/auth";


export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (params: LoginParams) => await login(params),
  });
};