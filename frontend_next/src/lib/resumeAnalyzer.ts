import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

// Resume Analysis System Prompt
const RESUME_ANALYZER_SYSTEM = `You are ResumeAI — an elite resume analyst combining the precision of a senior ATS engineer, the instincts of a FAANG-level hiring manager, and the honesty of a career coach who tells the truth. You analyze resumes against specific job applications and return a single, complete, valid JSON object. No prose. No markdown. Only JSON.

# INPUTS
{
  "company_name": "string",
  "job_title": "string", 
  "job_description": "string (full JD text)",
  "resume_text": "string (extracted resume text)",
  "analysis_depth": "quick | standard | deep"
}

# ABSOLUTE RULES
- Return ONLY valid JSON. Zero prose, zero markdown, zero explanation outside JSON.
- Never hallucinate skills, metrics, or experience not in the resume.
- Never fabricate JD requirements not in the job description.
- All scores are whole integers 0–100. No decimals.
- If resume_text is empty or <50 words → return error JSON.
- If job_description is missing → set jd_missing:true, skip jd_match scoring (score 0).
- Be brutally honest. Frame issues as opportunities. Never soften a critical flaw.
- Bullet rewrites must preserve actual candidate experience — never invent outcomes.

Return one complete JSON object with the following structure. If you are unsure about a specific field, return an empty array or null for it, but NEVER omit the keys specified in the schema. Ensure all fields in the provided schema are present in your output:
{
  "error": boolean,
  "error_code": "string | null",
  "message": "string | null",
  "overall_score": number,
  "sections": {
    "ats_compatibility": {
      "score": number,
      "strengths": ["string"],
      "weaknesses": ["string"]
    },
    "content_quality": {
      "score": number,
      "bullet_quantification_rate": {
        "experience": "string",
        "projects": "string"
      },
      "weak_bullet_count": number,
      "critical_content_flags": ["string"],
      "strengths": ["string"],
      "weaknesses": ["string"]
    },
    "jd_match": {
      "score": number,
      "matched_requirements": ["string"],
      "missing_requirements": [{
        "skill": "string",
        "severity": "critical|moderate|minor",
        "fix": "string"
      }],
      "seniority_match": "over-qualified|matched|under-qualified",
      "keyword_coverage_percent": number,
      "strengths": ["string"],
      "weaknesses": ["string"]
    },
    "structure_formatting": {
      "score": number,
      "strengths": ["string"],
      "weaknesses": ["string"]
    },
    "skills_section": {
      "score": number,
      "ghost_skills": ["string"],
      "generic_skills_to_remove": ["string"],
      "recommended_skills_to_add": ["string"],
      "strengths": ["string"],
      "weaknesses": ["string"]
    },
    "tone_style": {
      "score": number,
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  },
  "projects": [{
    "name": "string",
    "score": number,
    "status": "strong|good|needs_work|incomplete",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "negative_flags": [{
      "flag": "string",
      "impact": "critical|moderate|minor",
      "fix": "string"
    }],
    "stack_relevance": "high|medium|low",
    "suggested_improvement": "string"
  }],
  "negative_points": [{
    "rank": number,
    "severity": "critical|high|moderate|low",
    "section": "string",
    "issue": "string",
    "score_impact": number,
    "effort": "5min|15min|30min|1hr|half-day",
    "fix": "string",
    "example": "string | null"
  }],
  "bullet_rewrites": [{
    "section": "Experience|Projects",
    "company_or_project": "string",
    "original": "string",
    "issues": ["string"],
    "rewritten": "string",
    "why_better": "string",
    "add_metric_here": "string | null"
  }],
  "company_intelligence": {
    "company_type": "startup|scaleup|enterprise|faang|fintech|agency|nonprofit|consulting|government",
    "culture_signals": ["string"],
    "resume_style_fit": "strong|moderate|weak",
    "style_mismatch_reason": "string | null",
    "company_specific_tips": ["string"],
    "red_flags_for_this_company": ["string"]
  },
  "interview_preparation": [{
    "question": "string",
    "why_theyll_ask": "string",
    "difficulty": "easy|medium|hard",
    "star_outline": {
      "situation": "string",
      "task": "string", 
      "action": "string",
      "result": "string"
    },
    "watch_out": "string"
  }],
  "checklist": [{
    "check": "string",
    "passed": boolean,
    "tip": "string | null"
  }],
  "missing_sections": ["string"]
}`;

export interface ResumeAnalysisInput {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  analysisDepth?: "quick" | "standard" | "deep";
}

export interface ResumeAnalysisResult {
  error?: boolean;
  error_code?: string;
  message?: string;
  overall_score?: number;
  sections?: {
    ats_compatibility: {
      score: number;
      strengths: string[];
      weaknesses: string[];
    };
    content_quality: {
      score: number;
      bullet_quantification_rate: {
        experience: string;
        projects: string;
      };
      weak_bullet_count: number;
      critical_content_flags: string[];
      strengths: string[];
      weaknesses: string[];
    };
    jd_match: {
      score: number;
      matched_requirements: string[];
      missing_requirements: Array<{
        skill: string;
        severity: "critical" | "moderate" | "minor";
        fix: string;
      }>;
      seniority_match: "over-qualified" | "matched" | "under-qualified";
      keyword_coverage_percent: number;
      strengths: string[];
      weaknesses: string[];
    };
    structure_formatting: {
      score: number;
      strengths: string[];
      weaknesses: string[];
    };
    skills_section: {
      score: number;
      ghost_skills: string[];
      generic_skills_to_remove: string[];
      recommended_skills_to_add: string[];
      strengths: string[];
      weaknesses: string[];
    };
    tone_style: {
      score: number;
      strengths: string[];
      weaknesses: string[];
    };
  };
  projects?: Array<{
    name: string;
    score: number;
    status: "strong" | "good" | "needs_work" | "incomplete";
    strengths: string[];
    weaknesses: string[];
    negative_flags: Array<{
      flag: string;
      impact: "critical" | "moderate" | "minor";
      fix: string;
    }>;
    stack_relevance: "high" | "medium" | "low";
    suggested_improvement: string;
  }>;
  negative_points?: Array<{
    rank: number;
    severity: "critical" | "high" | "moderate" | "low";
    section: string;
    issue: string;
    score_impact: number;
    effort: "5min" | "15min" | "30min" | "1hr" | "half-day";
    fix: string;
    example: string | null;
  }>;
  bullet_rewrites?: Array<{
    section: "Experience" | "Projects";
    company_or_project: string;
    original: string;
    issues: string[];
    rewritten: string;
    why_better: string;
    add_metric_here: string | null;
  }>;
  company_intelligence?: {
    company_type:
    | "startup"
    | "scaleup"
    | "enterprise"
    | "faang"
    | "fintech"
    | "agency"
    | "nonprofit"
    | "consulting"
    | "government";
    culture_signals: string[];
    resume_style_fit: "strong" | "moderate" | "weak";
    style_mismatch_reason: string | null;
    company_specific_tips: string[];
    red_flags_for_this_company: string[];
  };
  interview_preparation?: Array<{
    question: string;
    why_theyll_ask: string;
    difficulty: "easy" | "medium" | "hard";
    star_outline: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    watch_out: string;
  }>;
  checklist?: Array<{
    check: string;
    passed: boolean;
    tip: string | null;
  }>;
  missing_sections?: string[];
}

export const analyzeResume = async (
  input: ResumeAnalysisInput,
): Promise<ResumeAnalysisResult> => {
  try {
    // Validate inputs
    if (!input.resumeText || input.resumeText.trim().length < 50) {
      return {
        error: true,
        error_code: input.resumeText ? "TOO_SHORT" : "EMPTY_RESUME",
        message: input.resumeText
          ? "Resume too short to analyze."
          : "No resume content found.",
      };
    }

    const model = groq("llama-3.3-70b-versatile");

    const { text } = await generateText({
      model,
      prompt: `Analyze the following resume against the job application:

Company: ${input.companyName}
Job Title: ${input.jobTitle}
Job Description: ${input.jobDescription}
Resume Text: ${input.resumeText}
Analysis Depth: ${input.analysisDepth || "standard"}

Provide a complete JSON analysis following the specified schema. Return ONLY valid JSON.`,
      system: RESUME_ANALYZER_SYSTEM,
      temperature: 0.1,
    });

    // Clean the text from possible markdown blocks
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanText);
      return parsed as ResumeAnalysisResult;
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanText);
      throw new Error("AI returned invalid JSON format. Please try again.");
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      error: true,
      error_code: "ANALYSIS_FAILED",
      message: error instanceof Error ? error.message : "Failed to analyze resume. Please try again.",
    };
  }
};
