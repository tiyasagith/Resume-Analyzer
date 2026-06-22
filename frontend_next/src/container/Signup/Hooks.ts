"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { signupApi } from "./SignupApi";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  const router = useRouter();
  const { login } = useAuth();

  const formSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const form = useForm<SignupFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = {
        userName: data.name,
        email: data.email,
        password: data.password,
      };

      const res = await signupApi(payload);

      if (res.status === 201) {
        // The backend now returns user info in the response
        const userData = {
          id: res.data.id,
          userName: res.data.userName || data.name,
          email: res.data.email || data.email,
          profileImage: res.data.profileImage,
        };
        login(res.data.accessToken, res.data.refreshToken, userData);

        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error; // Re-throw to let react-hook-form handle the error state
    }
  };

  return {
    form,
    onSubmit,
  };
};
