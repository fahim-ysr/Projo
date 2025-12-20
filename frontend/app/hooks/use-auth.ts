import type { SignUpFormData } from "@/routes/auth/sign-up";
import { signUpSchema } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/fetch-util";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
  });
};
