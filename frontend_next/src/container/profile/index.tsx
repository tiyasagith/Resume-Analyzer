"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import { User as UserIcon, Mail, Camera, Save, ArrowLeft, Loader2, Lock } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileFormData {
  userName: string;
}

export default function ProfileContainer() {
  const { user, updateUserProfile } = useAuth();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email is read-only — only userName is editable
  const formSchema = yup.object({
    userName: yup
      .string()
      .required("Username is required")
      .min(3, "Must be at least 3 characters"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      userName: "",
    },
  });

  // Pre-fill user data when user object is loaded
  useEffect(() => {
    if (user) {
      setValue("userName", user.userName || "");
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSaving(true);
    try {
      let imageUrl = user.profileImage || "";

      // Upload image to ImageKit if a new file is chosen
      if (imageFile) {
        console.log("Uploading profile picture to ImageKit...");
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "resumes/profile-images");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.url;
        console.log("Profile picture uploaded successfully:", imageUrl);
      }

      // Update backend via dedicated profile endpoint (email is excluded — non-editable)
      console.log("Saving profile changes to database...");
      const updateResponse = await api.put(`/profile/${user.id}`, {
        userName: data.userName,
        profileImage: imageUrl,
      });

      if (updateResponse.status !== 200 && updateResponse.status !== 201) {
        throw new Error("Failed to update user profile in database");
      }

      // Update auth context state and cookies
      updateUserProfile({
        userName: data.userName,
        email: user.email,      // keep existing email unchanged
        profileImage: imageUrl,
      });

      toast.success("Profile updated successfully!");
      setImageFile(null);
    } catch (error: any) {
      console.error("Profile update error:", error);
      // Show server-side conflict message if available (e.g. username taken)
      const serverMessage =
        error?.response?.data?.message || error.message || "Failed to update profile";
      toast.error(serverMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl">
          {/* Back Button */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 translate-x-0 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 sm:p-10 relative overflow-hidden"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
                Profile Settings
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                Update your username and profile image.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Profile Photo
                </label>
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <Avatar className="w-28 h-28 border-4 border-card shadow-lg hover:brightness-90 transition-all">
                    <AvatarImage src={imagePreview || ""} alt={user?.userName || "User"} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl font-extrabold">
                      {user?.userName?.charAt(0).toUpperCase() || <UserIcon className="w-10 h-10" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to upload JPG or PNG. Max size 5MB.
                </p>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {/* Username — editable */}
                <div>
                  <label htmlFor="userName" className="text-sm font-medium text-foreground block mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="userName"
                      type="text"
                      className={`w-full pl-10 pr-4 h-12 rounded-xl bg-card border ${
                        errors.userName
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-border/50 focus:border-primary"
                      } focus:outline-none transition-colors text-sm`}
                      placeholder="Your username"
                      {...register("userName")}
                    />
                  </div>
                  {errors.userName && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.userName.message}</p>
                  )}
                </div>

                {/* Email — read-only, non-editable */}
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground block mb-2">
                    Email Address
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground font-normal">
                      <Lock className="w-3 h-3" />
                      Not editable
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 h-12 rounded-xl bg-muted/50 border border-border/30 text-muted-foreground text-sm cursor-not-allowed select-none opacity-70"
                      placeholder="you@example.com"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Email cannot be changed after registration.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full h-12 rounded-xl bg-gradient-primary hover:brightness-105 active:scale-[0.99] text-primary-foreground font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
