"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadResumeApi, analyzeResumeApi } from "./UploadApi";
import { saveAnalysisToBackend } from "@/inngest/api";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

export interface UploadFormData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}

export const useUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const formSchema = yup.object({
    companyName: yup.string().required("Company name is required"),
    jobTitle: yup.string().required("Job title is required"),
    jobDescription: yup.string().required("Job description is required"),
  });

  const form = useForm<UploadFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!file) {
      toast.error("Please upload a resume file");
      return;
    }

    if (!file.type.includes("pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }

    const activeUserId = user?.id || Cookies.get("userId");
    if (!activeUserId || activeUserId === "anonymous") {
      toast.error("User session expired. Please log in again.");
      router.push("/login");
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Parse PDF to extract text
      console.log("Parsing PDF...");
      let resumeText = "";

      try {
        // Dynamic import to avoid SSR issues
        const { parsePDFSimple } = await import("@/lib/pdfParser");
        resumeText = await parsePDFSimple(file);
        console.log("PDF parsed with pdf-parse");
      } catch (pdfError) {
        console.error("PDF parsing failed:", pdfError);
        throw new Error(
          "Failed to parse PDF file. Please ensure it's a valid PDF document.",
        );
      }

      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error(
          "Resume text is too short or could not be extracted properly",
        );
      }

      // Step 2: Upload PDF to ImageKit for storage
      console.log("Uploading to ImageKit...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `resumes/${activeUserId}`);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(
          errorData.details || "Failed to upload file to storage",
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log("File uploaded to ImageKit:", uploadResult.url);

      // Step 3: Analyze resume with AI
      console.log("Analyzing resume with AI...");

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          resumeText: resumeText,
          analysisDepth: "standard",
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.message || "Resume analysis failed");
      }

      const analysisResult = await analysisResponse.json();

      console.log("Analysis completed:", analysisResult);

      // Step 4: Save results to database directly
      await saveAnalysisToBackend({
        fileData: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        },
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        userId: activeUserId.toString(),
        resumeText: resumeText,
        analysisResult: analysisResult,
      });

      console.log("Resume upload, analysis, and save completed successfully");

      toast.success(
        `Resume uploaded! Analysis score: ${analysisResult.overall_score}/100`,
      );
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload and analyze resume");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    form,
    file,
    dragActive,
    isUploading,
    inputRef,
    handleDrag,
    handleDrop,
    handleChange,
    onSubmit,
    removeFile,
  };
};
