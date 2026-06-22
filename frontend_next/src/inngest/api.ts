"use server";

// src/inngest/api.ts
import { inngest } from "./client";
import { doPostApiCall } from "@/lib/api";

export const sendResumeUploadEvent = async (data: {
  fileData: {
    name: string;
    size: number;
    type: string;
    url: string;
    fileId: string;
  };
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  userId: string;
  resumeText: string;
}) => {
  try {
    await inngest.send({
      name: "resume/upload.started",
      data,
    });
    console.log("Resume upload event sent successfully");
  } catch (error) {
    console.error("Failed to send resume upload event:", error);
    throw error;
  }
};

// New function to save analysis results to backend
export const saveAnalysisToBackend = async (data: {
  fileData: {
    name: string;
    size: number;
    type: string;
    url: string;
    fileId: string;
  };
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  userId: string;
  resumeText: string;
  analysisResult: any;
}) => {
  try {
    const analysisRequest = {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      userId: data.userId || "unknown",
      resumeText: data.resumeText,
      fileData: data.fileData,
      analysisResult: data.analysisResult,
    };

    console.log("------------------------------------------");
    console.log("SERVER ACTION: saveAnalysisToBackend");
    console.log("Saving analysis for userId:", analysisRequest.userId);

    // Call backend directly using axios (no auth for Inngest server-side calls)
    const axios = (await import("axios")).default;
    const response = await axios.post(
      "http://127.0.0.1:8081/api/resume-analysis",
      analysisRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("SUCCESS: Analysis saved to backend");
    console.log("------------------------------------------");
    return response.data;
  } catch (error) {
    console.log("------------------------------------------");
    console.error("FAILURE: Failed to save analysis to backend", error);
    if ((import("axios") as any).isAxiosError && (error as any).response) {
      console.error("Status:", (error as any).response.status);
      console.error("Data:", (error as any).response.data);
    } else {
      console.error("Error:", (error as any).message);
    }
    console.log("------------------------------------------");
    throw error;
  }
};

export const sendTaskCreatedEvent = async (data: { id: string }) => {
  try {
    await inngest.send({
      name: "app/task.created",
      data,
    });
    console.log("Task created event sent successfully");
  } catch (error) {
    console.error("Failed to send task created event:", error);
    throw error;
  }
};
