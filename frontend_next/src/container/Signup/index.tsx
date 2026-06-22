"use client";

import { useSignup, SignupFormData } from "./Hooks";
import SignupComponent from "@/components/Signup";

const SignupContainer = () => {
  const { form, onSubmit } = useSignup();

  return <SignupComponent form={form} onSubmit={onSubmit} />;
};

export default SignupContainer;
