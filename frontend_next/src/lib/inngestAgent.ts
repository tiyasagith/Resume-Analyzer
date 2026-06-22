import { Inngest } from "inngest";

// Create Inngest client
export const inngest = new Inngest({
  id: "resume-analyzer",
  name: "Resume Analyzer App",
});

// Type definitions for Inngest events
interface ResumeAnalysisEvent {
  data: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    resumeText: string;
    analysisDepth?: "quick" | "standard" | "deep";
  };
}

interface ResumeImprovementEvent {
  data: {
    resumeText: string;
    targetRole: string;
  };
}

// Type definitions for function returns
interface Recommendation {
  type: string;
  priority: string;
  message: string;
  effort: string;
}

interface StructureAnalysis {
  hasSummary: boolean;
  hasExperience: boolean;
  hasSkills: boolean;
  hasEducation: boolean;
  sectionCount: number;
}

interface ImprovementSuggestion {
  section: string;
  suggestion: string;
  example: string;
  priority: "high" | "medium" | "low";
}

// Resume analysis function using AI AgentKit
export const resumeAnalysisFunction = inngest.createFunction(
  { id: "resume-analysis", triggers: { event: "resume/analysis.requested" } },
  async ({ event, step }: { event: ResumeAnalysisEvent; step: any }) => {
    const { companyName, jobTitle, jobDescription, resumeText, analysisDepth } =
      event.data;

    // Step 1: Validate input
    const validationResult = await step.run("validate-input", async () => {
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error(
          resumeText
            ? "Resume too short to analyze."
            : "No resume content found.",
        );
      }
      return { valid: true };
    });

    // Step 2: Extract key information from resume
    const resumeExtraction = await step.run("extract-resume-info", async () => {
      // This would use AI to extract structured data from resume
      // For now, we'll simulate this step
      return {
        skills: ["JavaScript", "React", "TypeScript", "Node.js"],
        experience: "5 years",
        education: "Bachelor's in Computer Science",
        projects: 3,
      };
    });

    // Step 3: Analyze job requirements
    const jobAnalysis = await step.run("analyze-job-requirements", async () => {
      // This would use AI to analyze job description
      return {
        requiredSkills: ["React", "TypeScript", "Node.js", "AWS"],
        experienceLevel: "mid-senior",
        keyResponsibilities: ["Full-stack development", "System design"],
      };
    });

    // Step 4: Perform matching analysis
    const matchingAnalysis = await step.run(
      "perform-matching-analysis",
      async () => {
        const { skills: resumeSkills, experience } = resumeExtraction;
        const { requiredSkills, experienceLevel } = jobAnalysis;

        // Calculate skill match percentage
        const matchedSkills = resumeSkills.filter((skill: any) =>
          requiredSkills.includes(skill),
        );
        const skillMatchPercentage =
          (matchedSkills.length / requiredSkills.length) * 100;

        // Experience match (simplified)
        const experienceMatch =
          experience === "5 years" && experienceLevel === "mid-senior";

        return {
          skillMatchPercentage,
          matchedSkills,
          missingSkills: requiredSkills.filter(
            (skill: any) => !resumeSkills.includes(skill),
          ),
          experienceMatch,
          overallMatchScore:
            skillMatchPercentage * 0.7 + (experienceMatch ? 30 : 0),
        };
      },
    );

    // Step 5: Generate recommendations
    const recommendations: Recommendation[] = await step.run(
      "generate-recommendations",
      async () => {
        const { missingSkills, overallMatchScore } = matchingAnalysis;

        const recommendations: Recommendation[] = [];

        if (missingSkills.length > 0) {
          recommendations.push({
            type: "skill_gap",
            priority: "high",
            message: `Consider adding experience with: ${missingSkills.join(", ")}`,
            effort: "1-2 months",
          });
        }

        if (overallMatchScore < 70) {
          recommendations.push({
            type: "overall_improvement",
            priority: "medium",
            message:
              "Resume needs significant improvements to match job requirements",
            effort: "2-4 hours",
          });
        }

        return recommendations;
      },
    );

    // Step 6: Generate final report
    const finalReport = await step.run("generate-final-report", async () => {
      return {
        companyName,
        jobTitle,
        analysisDate: new Date().toISOString(),
        overallScore: Math.round(matchingAnalysis.overallMatchScore),
        sections: {
          skills_match: {
            score: Math.round(matchingAnalysis.skillMatchPercentage),
            matchedSkills: matchingAnalysis.matchedSkills,
            missingSkills: matchingAnalysis.missingSkills,
          },
          experience_match: {
            score: matchingAnalysis.experienceMatch ? 85 : 60,
            match: matchingAnalysis.experienceMatch,
          },
        },
        recommendations,
        status:
          matchingAnalysis.overallMatchScore >= 70
            ? "strong_candidate"
            : "needs_improvement",
      };
    });

    return finalReport;
  },
);

// Additional function for resume improvement suggestions
export const resumeImprovementFunction = inngest.createFunction(
  {
    id: "resume-improvement",
    triggers: { event: "resume/improvement.requested" },
  },
  async ({ event, step }: { event: ResumeImprovementEvent; step: any }) => {
    const { resumeText, targetRole } = event.data;

    // Step 1: Analyze current resume structure
    const structureAnalysis: StructureAnalysis = await step.run(
      "analyze-structure",
      async () => {
        // This would analyze the resume structure, sections, formatting
        return {
          hasSummary:
            resumeText.toLowerCase().includes("summary") ||
            resumeText.toLowerCase().includes("objective"),
          hasExperience: resumeText.toLowerCase().includes("experience"),
          hasSkills: resumeText.toLowerCase().includes("skills"),
          hasEducation: resumeText.toLowerCase().includes("education"),
          sectionCount: 4, // Simplified count
        };
      },
    );

    // Step 2: Generate improvement suggestions
    const improvements: ImprovementSuggestion[] = await step.run(
      "generate-improvements",
      async () => {
        const suggestions: ImprovementSuggestion[] = [];

        if (!structureAnalysis.hasSummary) {
          suggestions.push({
            section: "Professional Summary",
            suggestion: "Add a compelling professional summary at the top",
            example:
              "Senior Full Stack Developer with 5+ years of experience building scalable web applications",
            priority: "high" as const,
          });
        }

        if (!structureAnalysis.hasSkills) {
          suggestions.push({
            section: "Skills Section",
            suggestion:
              "Create a dedicated skills section with technical competencies",
            example:
              "Technical Skills: JavaScript, React, Node.js, TypeScript, AWS",
            priority: "high" as const,
          });
        }

        return suggestions;
      },
    );

    return {
      resumeText,
      targetRole,
      structureAnalysis,
      improvements,
      improvementPlan: {
        immediateActions: improvements.filter((i) => i.priority === "high"),
        longTermActions: improvements.filter(
          (i) => i.priority === "medium" || i.priority === "low",
        ),
      },
    };
  },
);
