// src/inngest/functions.ts
import { inngest } from "./client";
import { analyzeResume } from "@/lib/resumeAnalyzer";
import { saveAnalysisToBackend } from "./api";

export const processResumeUpload = inngest.createFunction(
  { id: "process-resume-upload", triggers: { event: "resume/upload.started" } },
  async ({ event, step }) => {
    const { fileData, companyName, jobTitle, jobDescription, userId } =
      event.data;

    // Step 1: Upload file to storage
    const uploadResult = await step.run("upload-file", async () => {
      // Simulate file upload - in real app, upload to S3, Cloudinary, etc.
      console.log("Uploading file:", fileData.name);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload time
      return {
        fileId: `file_${Date.now()}`,
        fileName: fileData.name,
        fileSize: fileData.size,
        url: `https://storage.example.com/resumes/${fileData.name}`,
      };
    });

    // Step 2: Process resume with AI-powered ATS analysis
    const atsResult = await step.run("analyze-resume-with-ai", async () => {
      console.log("Analyzing resume with AI for:", companyName, jobTitle);

      try {
        // Extract text from file (assuming fileData contains the resume text)
        const resumeText = event.data.resumeText || "";

        if (!resumeText) {
          throw new Error("Resume text is required for AI analysis");
        }

        // Use the AI resume analyzer
        const analysisResult = await analyzeResume({
          companyName,
          jobTitle,
          jobDescription,
          resumeText,
          analysisDepth: "standard",
        });

        if (analysisResult.error) {
          throw new Error(analysisResult.message || "AI analysis failed");
        }

        return {
          atsScore: analysisResult.overall_score || 0,
          sections: analysisResult.sections,
          projects: analysisResult.projects,
          negative_points: analysisResult.negative_points,
          bullet_rewrites: analysisResult.bullet_rewrites,
          company_intelligence: analysisResult.company_intelligence,
          interview_preparation: analysisResult.interview_preparation,
          checklist: analysisResult.checklist,
          missing_sections: analysisResult.missing_sections,
          keywords:
            analysisResult.sections?.jd_match?.matched_requirements || [],
          missingKeywords:
            analysisResult.sections?.jd_match?.missing_requirements?.map(
              (req) => req.skill,
            ) || [],
          suggestions:
            analysisResult.negative_points?.map((point) => point.fix) || [],
        };
      } catch (error) {
        console.error("AI Analysis failed:", error);
        // Fallback to basic analysis if AI fails
        return {
          atsScore: 50,
          keywords: [],
          missingKeywords: [],
          suggestions: [
            "Resume analysis encountered an error. Please try again.",
          ],
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    // Step 3: Save results to database via backend API
    const saveResult = await step.run("save-results", async () => {
      console.log("Saving analysis results to backend");

      try {
        const backendResponse = await saveAnalysisToBackend({
          fileData: {
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            url: fileData.url,
            fileId: fileData.fileId,
          },
          companyName,
          jobTitle,
          jobDescription,
          userId,
          resumeText: event.data.resumeText || "",
          analysisResult: {
            overall_score: atsResult.atsScore,
            sections: (atsResult as any).sections || null,
            projects: (atsResult as any).projects || null,
            negative_points: (atsResult as any).negative_points || null,
            bullet_rewrites: (atsResult as any).bullet_rewrites || null,
            company_intelligence:
              (atsResult as any).company_intelligence || null,
            interview_preparation:
              (atsResult as any).interview_preparation || null,
            checklist: (atsResult as any).checklist || null,
            missing_sections: (atsResult as any).missing_sections || null,
            keywords: atsResult.keywords || [],
            missingKeywords: atsResult.missingKeywords || [],
            suggestions: atsResult.suggestions || [],
            error: (atsResult as any).error || null,
          },
        });

        return {
          analysisId: backendResponse.data?.id || `analysis_${Date.now()}`,
          saved: true,
          backendResponse: backendResponse.data,
        };
      } catch (error) {
        console.error("Failed to save to backend:", error);
        // Fallback: still return success but note the backend save failed
        return {
          analysisId: `analysis_${Date.now()}`,
          saved: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    return {
      success: true,
      uploadResult,
      atsResult,
      saveResult,
      message: "Resume processed successfully",
    };
  },
);

// Keep the original processTask for testing
export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  },
);

// AI AgentKit: Advanced Resume Analysis Function
export const aiResumeAnalysis = inngest.createFunction(
  {
    id: "ai-resume-analysis",
    name: "AI Resume Analysis",
    triggers: { event: "resume/ai-analysis.requested" },
  },
  async ({ event, step }) => {
    const { resumeText, jobDescription, companyName, jobTitle, analysisType } =
      event.data;

    // Step 1: Pre-process and validate inputs
    const validation = await step.run("validate-inputs", async () => {
      if (!resumeText || resumeText.length < 100) {
        throw new Error("Resume text too short for meaningful analysis");
      }
      if (!jobDescription || jobDescription.length < 50) {
        throw new Error("Job description too short for comparison");
      }
      return { valid: true };
    });

    // Step 2: Extract structured data from resume
    const resumeStructure = await step.run(
      "extract-resume-structure",
      async () => {
        // Use AI to parse resume into structured format
        const lines = resumeText
          .split("\n")
          .filter((line: string) => line.trim());
        const sections = {
          summary: lines.find(
            (line: string) =>
              line.toLowerCase().includes("summary") ||
              line.toLowerCase().includes("objective"),
          ),
          experience: lines.filter(
            (line: string) =>
              line.toLowerCase().includes("experience") ||
              line.match(/\d{4}.*\d{4}/),
          ),
          education: lines.filter(
            (line: string) =>
              line.toLowerCase().includes("education") ||
              line.toLowerCase().includes("university"),
          ),
          skills: lines.filter(
            (line: string) =>
              line.toLowerCase().includes("skills") ||
              line.includes("JavaScript") ||
              line.includes("React"),
          ),
          projects: lines.filter((line: string) =>
            line.toLowerCase().includes("project"),
          ),
        };

        return {
          totalLines: lines.length,
          sections,
          hasQuantifiedMetrics:
            resumeText.match(/\d+%|\$\d+|\d+x|\d+\+/g) !== null,
          actionVerbs:
            resumeText.match(
              /\b(developed|created|implemented|led|managed|optimized|increased|reduced)\b/gi,
            )?.length || 0,
        };
      },
    );

    // Step 3: Perform comprehensive AI analysis
    const comprehensiveAnalysis = await step.run(
      "comprehensive-ai-analysis",
      async () => {
        try {
          const analysisResult = await analyzeResume({
            companyName,
            jobTitle,
            jobDescription,
            resumeText,
            analysisDepth: analysisType || "deep",
          });

          if (analysisResult.error) {
            throw new Error(analysisResult.message);
          }

          return analysisResult;
        } catch (error) {
          console.error("Comprehensive analysis failed:", error);
          throw error;
        }
      },
    );

    // Step 4: Generate actionable improvement plan
    const improvementPlan = await step.run(
      "generate-improvement-plan",
      async () => {
        const analysis = comprehensiveAnalysis;
        const structure = resumeStructure;

        const improvements = [];

        // Analyze bullet points
        if (
          analysis.sections?.content_quality?.weak_bullet_count &&
          analysis.sections.content_quality.weak_bullet_count > 0
        ) {
          improvements.push({
            category: "Content Quality",
            priority: "high",
            issue: `Found ${analysis.sections.content_quality.weak_bullet_count} weak bullet points`,
            suggestions:
              analysis.bullet_rewrites?.slice(0, 3).map((rewrite: any) => ({
                original: rewrite.original,
                improved: rewrite.rewritten,
                reason: rewrite.why_better,
              })) || [],
            estimatedTime: "30-45 minutes",
          });
        }

        // Analyze skills gap
        if (
          analysis.sections?.jd_match?.missing_requirements &&
          analysis.sections.jd_match.missing_requirements.length > 0
        ) {
          const criticalSkills = analysis.sections.jd_match.missing_requirements
            .filter((req: any) => req.severity === "critical")
            .map((req: any) => req.skill);

          if (criticalSkills.length > 0) {
            improvements.push({
              category: "Skills Gap",
              priority: "critical",
              issue: `Missing critical skills: ${criticalSkills.join(", ")}`,
              suggestions: criticalSkills.map((skill: string) => ({
                skill,
                learningResource: `Consider taking a course or project in ${skill}`,
                timeframe: "1-3 months",
              })),
              estimatedTime: "1-3 months",
            });
          }
        }

        // Structure improvements
        if (!structure.hasQuantifiedMetrics) {
          improvements.push({
            category: "Quantification",
            priority: "high",
            issue: "Resume lacks quantified achievements",
            suggestions: [
              "Add specific metrics (%, $, numbers) to your achievements",
              "Include impact measurements for each project",
              "Quantify team size, budget, or scope where applicable",
            ],
            estimatedTime: "1-2 hours",
          });
        }

        return improvements;
      },
    );

    // Step 5: Create interview preparation guide
    const interviewPrep = await step.run("create-interview-guide", async () => {
      const questions = comprehensiveAnalysis.interview_preparation || [];

      return {
        totalQuestions: questions.length,
        questionsByDifficulty: {
          easy: questions.filter((q: any) => q.difficulty === "easy").length,
          medium: questions.filter((q: any) => q.difficulty === "medium")
            .length,
          hard: questions.filter((q: any) => q.difficulty === "hard").length,
        },
        topQuestions: questions.slice(0, 5).map((q: any) => ({
          question: q.question,
          starOutline: q.star_outline,
          preparation: q.watch_out,
        })),
      };
    });

    return {
      success: true,
      analysis: {
        overallScore: comprehensiveAnalysis.overall_score,
        sections: comprehensiveAnalysis.sections,
        structure: resumeStructure,
        improvementPlan,
        interviewPrep,
        recommendations:
          comprehensiveAnalysis.negative_points?.slice(0, 5) || [],
      },
      metadata: {
        analysisType: analysisType || "deep",
        processingTime: new Date().toISOString(),
        companyName,
        jobTitle,
      },
    };
  },
);

// AI AgentKit: Resume Optimization Function
export const aiResumeOptimization = inngest.createFunction(
  {
    id: "ai-resume-optimization",
    name: "AI Resume Optimization",
    triggers: { event: "resume/optimization.requested" },
  },
  async ({ event, step }) => {
    const { resumeText, targetRole, targetCompany, optimizationGoals } =
      event.data;

    // Step 1: Analyze current resume state
    const currentState = await step.run("analyze-current-state", async () => {
      const wordCount = resumeText.split(/\s+/).length;
      const hasActionVerbs =
        resumeText.match(
          /\b(developed|created|implemented|led|managed|optimized|increased|reduced|achieved|launched)\b/gi,
        )?.length || 0;
      const hasMetrics =
        resumeText.match(/\d+%|\$\d+|\d+x|\d+\+/g)?.length || 0;

      return {
        wordCount,
        actionVerbCount: hasActionVerbs,
        metricCount: hasMetrics,
        actionVerbRatio: (hasActionVerbs / wordCount) * 100,
        metricRatio: (hasMetrics / wordCount) * 100,
        sections: {
          hasSummary: resumeText.toLowerCase().includes("summary"),
          hasExperience: resumeText.toLowerCase().includes("experience"),
          hasSkills: resumeText.toLowerCase().includes("skills"),
          hasEducation: resumeText.toLowerCase().includes("education"),
        },
      };
    });

    // Step 2: Generate optimized content suggestions
    const contentOptimization = await step.run(
      "generate-content-optimizations",
      async () => {
        const optimizations = [];

        // Summary optimization
        if (!currentState.sections.hasSummary) {
          optimizations.push({
            type: "add_summary",
            priority: "high",
            suggestion: `Add a compelling professional summary for ${targetRole} position`,
            template: `Senior ${targetRole} with [X] years of experience in [key areas]. Proven track record of [key achievement]. Seeking to leverage expertise in [specific skills] to drive success at ${targetCompany}.`,
            impact: "Improves first impression and ATS keyword matching",
          });
        }

        // Action verb optimization
        if (currentState.actionVerbRatio < 5) {
          optimizations.push({
            type: "improve_action_verbs",
            priority: "high",
            suggestion: "Replace passive language with strong action verbs",
            examples: [
              "Responsible for managing team → Led team of [X] developers",
              "Worked on project → Developed and implemented [feature]",
              "Helped increase revenue → Increased revenue by [X]% through [strategy]",
            ],
            impact: "Makes achievements more impactful and professional",
          });
        }

        // Metrics optimization
        if (currentState.metricRatio < 2) {
          optimizations.push({
            type: "add_metrics",
            priority: "critical",
            suggestion: "Add quantifiable metrics to demonstrate impact",
            examples: [
              "Improved performance → Improved application performance by 40%",
              "Managed budget → Managed $500K annual budget with 15% cost savings",
              "Led team → Led team of 8 engineers, delivering 3 major projects 20% ahead of schedule",
            ],
            impact: "Provides concrete evidence of achievements",
          });
        }

        return optimizations;
      },
    );

    // Step 3: Generate ATS optimization recommendations
    const atsOptimization = await step.run(
      "generate-ats-optimizations",
      async () => {
        const recommendations = [];

        // Keyword analysis
        const targetKeywords = targetRole.toLowerCase().split(" ");
        const resumeLower = resumeText.toLowerCase();
        const missingKeywords = targetKeywords.filter(
          (keyword: string) => !resumeLower.includes(keyword),
        );

        if (missingKeywords.length > 0) {
          recommendations.push({
            type: "keyword_optimization",
            priority: "high",
            missingKeywords,
            suggestion: `Incorporate these keywords: ${missingKeywords.join(", ")}`,
            placement: "Add to skills section and experience descriptions",
          });
        }

        // Formatting recommendations
        recommendations.push({
          type: "formatting",
          priority: "medium",
          suggestions: [
            "Use standard section headers (Experience, Education, Skills)",
            "Avoid tables, columns, or complex formatting",
            "Use bullet points for experience descriptions",
            "Save as .docx or .pdf (not .pages or other formats)",
          ],
        });

        return recommendations;
      },
    );

    // Step 4: Create optimization action plan
    const actionPlan = await step.run("create-action-plan", async () => {
      const allOptimizations = [...contentOptimization, ...atsOptimization];

      const prioritized = allOptimizations.sort((a: any, b: any) => {
        const priorityOrder: { [key: string]: number } = {
          critical: 3,
          high: 2,
          medium: 1,
          low: 0,
        };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      });

      return {
        immediateActions: prioritized.filter(
          (opt) => opt.priority === "critical" || opt.priority === "high",
        ),
        shortTermActions: prioritized.filter(
          (opt) => opt.priority === "medium",
        ),
        longTermActions: prioritized.filter((opt) => opt.priority === "low"),
        estimatedTotalTime: "2-4 hours",
        expectedImpact:
          "Significant improvement in ATS scoring and recruiter response",
      };
    });

    return {
      success: true,
      currentState,
      optimizations: {
        content: contentOptimization,
        ats: atsOptimization,
      },
      actionPlan,
      nextSteps: [
        "Review and implement critical optimizations first",
        "Test optimized resume with ATS scanner",
        "Get feedback from industry professionals",
        "Track application response rates",
      ],
    };
  },
);
