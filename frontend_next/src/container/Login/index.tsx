"use client";

import { useLogin, LoginFormData } from "./Hooks";
import LoginComponent from "@/components/Login";

const LoginContainer = () => {
  const { form, onSubmit } = useLogin();

  return <LoginComponent form={form} onSubmit={onSubmit} />;
};

export default LoginContainer;
