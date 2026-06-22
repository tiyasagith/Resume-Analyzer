"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { loginApi } from "./LoginApi";

export interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuth();

  const formSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const form = useForm<LoginFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginApi({
        userName: data.email,
        password: data.password,
      });

      // The backend now returns user info in the response
      const userData = {
        id: res.data.id,
        userName: res.data.userName || data.email,
        email: res.data.email || data.email,
        profileImage: res.data.profileImage,
      };
      login(res.data.accessToken, res.data.refreshToken, userData);

      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (error: any) {
      // Extract the error message from the backend JSON response body if available
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to log in";
      toast.error(serverMessage);
      throw error; // Re-throw to let react-hook-form handle the error state
    }
  };

  return {
    form,
    onSubmit,
  };
};
