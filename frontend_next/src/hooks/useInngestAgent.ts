import { useCallback } from "react";
import { inngest } from "@/inngest/client";

interface AIAnalysisInput {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
  analysisType?: "quick" | "standard" | "deep";
}

interface OptimizationInput {
  resumeText: string;
  targetRole: string;
  targetCompany?: string;
  optimizationGoals?: string[];
}

export const useInngestAgent = () => {
  // Trigger AI Resume Analysis
  const triggerAIAnalysis = useCallback(async (input: AIAnalysisInput) => {
    try {
      const event = await inngest.send({
        name: "resume/ai-analysis.requested",
        data: {
          resumeText: input.resumeText,
          jobDescription: input.jobDescription,
          companyName: input.companyName,
          jobTitle: input.jobTitle,
          analysisType: input.analysisType || "standard"
        }
      });

      return {
        success: true,
        eventId: event.ids[0],
        message: "AI analysis started successfully"
      };
    } catch (error) {
      console.error("Failed to trigger AI analysis:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, []);

  // Trigger Resume Optimization
  const triggerOptimization = useCallback(async (input: OptimizationInput) => {
    try {
      const event = await inngest.send({
        name: "resume/optimization.requested",
        data: {
          resumeText: input.resumeText,
          targetRole: input.targetRole,
          targetCompany: input.targetCompany || "",
          optimizationGoals: input.optimizationGoals || []
        }
      });

      return {
        success: true,
        eventId: event.ids[0],
        message: "Resume optimization started successfully"
      };
    } catch (error) {
      console.error("Failed to trigger optimization:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, []);

  // Trigger Standard Resume Upload (enhanced with AI)
  const triggerResumeUpload = useCallback(async (input: {
    fileData: File;
    resumeText: string;
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    userId?: string;
  }) => {
    try {
      const event = await inngest.send({
        name: "resume/upload.started",
        data: {
          fileData: {
            name: input.fileData.name,
            size: input.fileData.size,
            type: input.fileData.type
          },
          resumeText: input.resumeText,
          companyName: input.companyName,
          jobTitle: input.jobTitle,
          jobDescription: input.jobDescription,
          userId: input.userId || "anonymous"
        }
      });

      return {
        success: true,
        eventId: event.ids[0],
        message: "Resume upload and AI processing started"
      };
    } catch (error) {
      console.error("Failed to trigger resume upload:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, []);

  return {
    triggerAIAnalysis,
    triggerOptimization,
    triggerResumeUpload
  };
};
