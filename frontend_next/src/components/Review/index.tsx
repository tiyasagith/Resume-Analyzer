"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  Briefcase,
  Target,
  Sparkles,
  FileText,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Shield,
  Code2,
  MessageSquare,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  error: boolean;
  message: string | null;
  error_code: string | null;
  overall_score: number;
  missing_sections: string[];
  projects: Project[];
  sections: Sections;
  checklist: ChecklistItem[];
  bullet_rewrites: BulletRewrite[];
  negative_points: NegativePoint[];
  company_intelligence: CompanyIntelligence;
  interview_preparation: InterviewQuestion[];
}

interface Project {
  name: string;
  score: number;
  status: "strong" | "good" | "needs_work" | "incomplete";
  strengths: string[];
  weaknesses: string[];
  negative_flags: { fix: string; flag: string; impact: string }[];
  stack_relevance: "high" | "medium" | "low";
  suggested_improvement: string;
}

interface Sections {
  jd_match: JDMatch;
  tone_style: SectionBase;
  skills_section: SkillsSection;
  content_quality: ContentQuality;
  ats_compatibility: SectionBase;
  structure_formatting: SectionBase;
}

interface SectionBase {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

interface JDMatch extends SectionBase {
  seniority_match: string;
  matched_requirements: string[];
  missing_requirements: { fix: string; skill: string; severity: string }[];
  keyword_coverage_percent: number;
}

interface SkillsSection extends SectionBase {
  ghost_skills: string[];
  generic_skills_to_remove: string[];
  recommended_skills_to_add: string[];
}

interface ContentQuality extends SectionBase {
  weak_bullet_count: number;
  critical_content_flags: string[];
  bullet_quantification_rate: { projects: string; experience: string };
}

interface ChecklistItem {
  tip: string;
  check: string;
  passed: boolean;
}

interface BulletRewrite {
  issues: string[];
  section: string;
  original: string;
  rewritten: string;
  why_better: string;
  add_metric_here: string;
  company_or_project: string;
}

interface NegativePoint {
  fix: string;
  rank: number;
  issue: string;
  effort: string;
  example: string;
  section: string;
  severity: "critical" | "high" | "moderate" | "minor";
  score_impact: number;
}

interface CompanyIntelligence {
  company_type: string;
  culture_signals: string[];
  resume_style_fit: string;
  company_specific_tips: string[];
  style_mismatch_reason: string | null;
  red_flags_for_this_company: string[];
}

interface InterviewQuestion {
  question: string;
  watch_out: string;
  difficulty: "easy" | "medium" | "hard";
  star_outline: {
    task: string;
    action: string;
    result: string;
    situation: string;
  };
  why_theyll_ask: string;
}

interface ReviewPageData {
  analysisResult: AnalysisResult;
  companyName: string;
  createdAt: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  id: string;
  jobDescription: string;
  jobTitle: string;
  overallScore: number;
  resumeText: string;
  updatedAt: string;
  userId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scoreColor = (s: number) =>
  s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";

const scoreBg = (s: number) =>
  s >= 80
    ? "bg-green-50 text-green-700 border-green-200"
    : s >= 60
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";

const scoreLabel = (s: number) =>
  s >= 80 ? "Strong" : s >= 60 ? "Good" : s >= 40 ? "Needs Work" : "Poor";

const severityStyle = (sev: string) => {
  switch (sev) {
    case "critical":
      return "bg-red-50 border-red-200 text-red-700";
    case "high":
      return "bg-orange-50 border-orange-200 text-orange-700";
    case "moderate":
      return "bg-amber-50 border-amber-200 text-amber-700";
    default:
      return "bg-blue-50 border-blue-200 text-blue-700";
  }
};

const difficultyStyle = (d: string) => {
  switch (d) {
    case "hard":
      return "bg-red-50 text-red-700 border border-red-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-green-50 text-green-700 border border-green-200";
  }
};

// ─── Score Ring (Fixed) ───────────────────────────────────────────────────────

const ScoreRing = ({ score, size = 120 }: { score: number; size?: number }) => {
  const strokeWidth = size > 80 ? 8 : 6;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  const center = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ top: 0, left: 0 }}
      >
        <span
          className="font-black leading-none"
          style={{
            fontSize: size > 80 ? "1.75rem" : "1rem",
            color: color,
          }}
        >
          {score}
        </span>
        <span
          className="text-gray-400 mt-0.5"
          style={{ fontSize: size > 80 ? "0.65rem" : "0.55rem" }}
        >
          / 100
        </span>
      </div>
    </div>
  );
};

// ─── Mini Score Bar ───────────────────────────────────────────────────────────

const ScoreBar = ({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: any;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span
          className="text-xs font-bold"
          style={{ color: scoreColor(score) }}
        >
          {score}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor(score) }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  score,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  score: number;
  icon: any;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const color = scoreColor(score);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}30`,
            }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            <span className="text-xs font-medium" style={{ color }}>
              {scoreLabel(score)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-black" style={{ color }}>
            {score}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Strength / Weakness Lists ────────────────────────────────────────────────

const StrengthList = ({ items }: { items: string[] }) => (
  <div className="space-y-2">
    {items.map((item: string, i: number) => (
      <div key={i} className="flex gap-2.5 items-start">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
        <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
      </div>
    ))}
  </div>
);

const WeaknessList = ({ items }: { items: string[] }) => (
  <div className="space-y-2">
    {items.map((item: string, i: number) => (
      <div key={i} className="flex gap-2.5 items-start">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
        <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
      </div>
    ))}
  </div>
);

const Divider = () => <div className="h-px bg-gray-100 my-4" />;

// ─── Resume Preview ───────────────────────────────────────────────────────────

const ResumePreview = ({ data }: { data: ReviewPageData }) => {
  const lines = data.resumeText.split("\n").filter(Boolean);
  const name = lines[0] ?? "—";
  const contact = lines[1] ?? "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-black text-gray-900 text-lg leading-tight">
              {name}
            </h2>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {contact}
            </p>
          </div>
          <ScoreRing score={data.overallScore} size={64} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 bg-white">
            {data.jobTitle}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 bg-white">
            {data.companyName}
          </span>
        </div>
      </div>

      {/* File info */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <FileText className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">
            {data.fileName}
          </p>
          <p className="text-[10px] text-gray-400">
            {(data.fileSize / 1024).toFixed(0)} KB ·{" "}
            {new Date(data.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <a
          href={data.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </a>
      </div>

      {/* Score bars */}
      <div className="p-5 space-y-3.5 border-b border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Section Scores
        </p>
        <ScoreBar
          label="ATS Compatibility"
          score={data.analysisResult.sections.ats_compatibility.score}
          icon={Shield}
        />
        <ScoreBar
          label="JD Match"
          score={data.analysisResult.sections.jd_match.score}
          icon={Target}
        />
        <ScoreBar
          label="Content Quality"
          score={data.analysisResult.sections.content_quality.score}
          icon={FileText}
        />
        <ScoreBar
          label="Structure"
          score={data.analysisResult.sections.structure_formatting.score}
          icon={BarChart3}
        />
        <ScoreBar
          label="Skills"
          score={data.analysisResult.sections.skills_section.score}
          icon={Code2}
        />
        <ScoreBar
          label="Tone & Style"
          score={data.analysisResult.sections.tone_style.score}
          icon={MessageSquare}
        />
      </div>

      {/* Keyword coverage */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            JD Keyword Coverage
          </span>
          <span className="text-sm font-black text-gray-800">
            {data.analysisResult.sections.jd_match.keyword_coverage_percent}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{
              width: `${data.analysisResult.sections.jd_match.keyword_coverage_percent}%`,
            }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Projects */}
      <div className="p-5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Projects
        </p>
        <div className="space-y-2">
          {data.analysisResult.projects.map((proj: Project, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: scoreColor(proj.score) }}
                />
                <span className="text-xs text-gray-600 truncate">
                  {proj.name}
                </span>
              </div>
              <span
                className="text-xs font-bold shrink-0 ml-2"
                style={{ color: scoreColor(proj.score) }}
              >
                {proj.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Tab Navigation ───────────────────────────────────────────────────────────

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "sections", label: "Sections", icon: FileText },
  { id: "negatives", label: "Negatives", icon: AlertCircle },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "rewrites", label: "Rewrites", icon: RefreshCw },
  { id: "checklist", label: "Checklist", icon: CheckCircle2 },
  { id: "interview", label: "Interview", icon: MessageSquare },
  { id: "company", label: "Company Fit", icon: Briefcase },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResumeReviewComponent({
  currentAnalysis,
  loading,
  error,
}: {
  currentAnalysis: ReviewPageData | null;
  loading: boolean;
  error: string | null;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 text-center shadow-xl flex flex-col items-center justify-center"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
              />
              <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
            </div>
            
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">
              Analyzing Your Resume
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Our AI is busy crunching ATS compliance, drafting interview prep, and generating company intelligence.
            </p>
            
            <div className="w-full bg-muted/50 rounded-full h-1 overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-1/2 h-full bg-gradient-primary rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !currentAnalysis) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-card/85 backdrop-blur-xl rounded-2xl border border-border/50 p-8 text-center shadow-xl"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">
              Failed to Load Analysis
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              We couldn't retrieve the analysis for this resume. The ID may be invalid, or it might still be processing.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-colors cursor-pointer">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  const data = currentAnalysis;
  const ar = data.analysisResult;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Top Nav */}
        <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:block">Dashboard</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400 text-sm hidden sm:block truncate max-w-[160px]">
              {data.jobTitle}
            </span>
            <span className="text-gray-300 hidden sm:block">/</span>
            <span className="text-gray-700 text-sm font-medium">
              Resume Review
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full border font-medium ${scoreBg(data.overallScore)}`}
              >
                {data.overallScore}/100
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* ── Left: Resume Preview (sticky on desktop) ── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-[300px] xl:w-[320px] shrink-0"
            >
              <div className="lg:sticky lg:top-[4.5rem]">
                <ResumePreview data={data} />
              </div>
            </motion.div>

            {/* ── Right: Analysis ── */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              {/* Page title */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                      Resume Analysis
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                      {data.jobTitle} · {data.companyName} ·{" "}
                      {new Date(data.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      <span className="text-xs text-violet-600 font-medium">
                        AI Analysis
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero score card */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/30 pointer-events-none" />
                <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
                  <ScoreRing score={ar.overall_score} size={110} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h2 className="text-lg font-black text-gray-900">
                        Overall Score
                      </h2>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${scoreBg(ar.overall_score)}`}
                      >
                        {scoreLabel(ar.overall_score)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      Your resume was analyzed across 6 weighted dimensions
                      against the {data.jobTitle} role at {data.companyName}.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        {
                          label: "Negatives found",
                          val: ar.negative_points.length,
                          color: "text-red-500",
                          bg: "bg-red-50",
                          border: "border-red-100",
                        },
                        {
                          label: "Rewrites available",
                          val: ar.bullet_rewrites.length,
                          color: "text-amber-600",
                          bg: "bg-amber-50",
                          border: "border-amber-100",
                        },
                        {
                          label: "Missing sections",
                          val: ar.missing_sections.length,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                          border: "border-blue-100",
                        },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className={`${m.bg} rounded-xl border ${m.border} p-3 text-center`}
                        >
                          <div className={`text-xl font-black ${m.color}`}>
                            {m.val}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab: { id: string; label: string; icon: any }) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                        isActive
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:block">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── Tab Panels ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* OVERVIEW */}
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      {/* ATS */}
                      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">
                              ATS Compatibility
                            </h3>
                            <p className="text-xs text-gray-400">
                              How well your resume passes automated systems
                            </p>
                          </div>
                          <span
                            className="ml-auto text-2xl font-black"
                            style={{
                              color: scoreColor(
                                ar.sections.ats_compatibility.score,
                              ),
                            }}
                          >
                            {ar.sections.ats_compatibility.score}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {ar.sections.ats_compatibility.strengths.map(
                            (s: string, i: number) => (
                              <div key={i} className="flex gap-2 items-start">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-xs text-gray-600">
                                  {s}
                                </span>
                              </div>
                            ),
                          )}
                          {ar.sections.ats_compatibility.weaknesses.map(
                            (w: string, i: number) => (
                              <div key={i} className="flex gap-2 items-start">
                                <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                <span className="text-xs text-gray-600">
                                  {w}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* JD Match keywords */}
                      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-gray-800 text-sm">
                            JD Keyword Match
                          </h3>
                          <span className="text-xs text-blue-600 font-bold">
                            {ar.sections.jd_match.keyword_coverage_percent}%
                            coverage
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                            Matched Requirements
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {ar.sections.jd_match.matched_requirements.map(
                              (r, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700"
                                >
                                  {r}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                        {ar.sections.jd_match.missing_requirements.length >
                          0 && (
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                              Missing Requirements
                            </p>
                            <div className="space-y-2">
                              {ar.sections.jd_match.missing_requirements.map(
                                (m, i) => (
                                  <div
                                    key={i}
                                    className={`text-xs px-3 py-2 rounded-xl border ${severityStyle(m.severity)}`}
                                  >
                                    <span className="font-medium">
                                      {m.skill}
                                    </span>
                                    <span className="opacity-60 ml-2">
                                      — {m.fix}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Missing sections */}
                      {ar.missing_sections.length > 0 && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <h3 className="font-bold text-amber-700 text-sm">
                              Missing Sections
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ar.missing_sections.map((s, i) => (
                              <span
                                key={i}
                                className="text-xs px-3 py-1 rounded-lg bg-white border border-amber-200 text-amber-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTIONS */}
                  {activeTab === "sections" && (
                    <div className="space-y-3">
                      <SectionCard
                        title="Content Quality"
                        score={ar.sections.content_quality.score}
                        icon={FileText}
                        defaultOpen
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="text-[10px] text-gray-400 mb-1">
                                Experience bullets
                              </div>
                              <div className="text-sm font-bold text-gray-800">
                                {
                                  ar.sections.content_quality
                                    .bullet_quantification_rate.experience
                                }
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="text-[10px] text-gray-400 mb-1">
                                Project bullets
                              </div>
                              <div className="text-sm font-bold text-gray-800">
                                {
                                  ar.sections.content_quality
                                    .bullet_quantification_rate.projects
                                }
                              </div>
                            </div>
                          </div>
                          {ar.sections.content_quality.critical_content_flags
                            .length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <p className="text-[10px] text-red-600 uppercase tracking-wider mb-2 font-semibold">
                                Critical Flags
                              </p>
                              {ar.sections.content_quality.critical_content_flags.map(
                                (f, i) => (
                                  <div
                                    key={i}
                                    className="flex gap-2 items-start"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                    <span className="text-xs text-red-700">
                                      {f}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                          <Divider />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Strengths
                              </p>
                              <StrengthList
                                items={ar.sections.content_quality.strengths}
                              />
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Weaknesses
                              </p>
                              <WeaknessList
                                items={ar.sections.content_quality.weaknesses}
                              />
                            </div>
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        title="Skills Section"
                        score={ar.sections.skills_section.score}
                        icon={Code2}
                      >
                        <div className="space-y-4">
                          {ar.sections.skills_section.ghost_skills.length >
                            0 && (
                            <div>
                              <p className="text-[10px] text-red-600 uppercase tracking-wider mb-2 font-semibold">
                                Ghost Skills (remove)
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ar.sections.skills_section.ghost_skills.map(
                                  (s, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-600 line-through"
                                    >
                                      {s}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                          {ar.sections.skills_section.generic_skills_to_remove
                            .length > 0 && (
                            <div>
                              <p className="text-[10px] text-amber-600 uppercase tracking-wider mb-2 font-semibold">
                                Too Generic (replace)
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ar.sections.skills_section.generic_skills_to_remove.map(
                                  (s, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700"
                                    >
                                      {s}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                          {ar.sections.skills_section.recommended_skills_to_add
                            .length > 0 && (
                            <div>
                              <p className="text-[10px] text-green-600 uppercase tracking-wider mb-2 font-semibold">
                                Recommended to Add
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ar.sections.skills_section.recommended_skills_to_add.map(
                                  (s, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700"
                                    >
                                      + {s}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                          <Divider />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Strengths
                              </p>
                              <StrengthList
                                items={ar.sections.skills_section.strengths}
                              />
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Weaknesses
                              </p>
                              <WeaknessList
                                items={ar.sections.skills_section.weaknesses}
                              />
                            </div>
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        title="Tone & Style"
                        score={ar.sections.tone_style.score}
                        icon={MessageSquare}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                              Strengths
                            </p>
                            <StrengthList
                              items={ar.sections.tone_style.strengths}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                              Weaknesses
                            </p>
                            <WeaknessList
                              items={ar.sections.tone_style.weaknesses}
                            />
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        title="Structure & Formatting"
                        score={ar.sections.structure_formatting.score}
                        icon={BarChart3}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                              Strengths
                            </p>
                            <StrengthList
                              items={ar.sections.structure_formatting.strengths}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                              Weaknesses
                            </p>
                            <WeaknessList
                              items={
                                ar.sections.structure_formatting.weaknesses
                              }
                            />
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        title="JD Match"
                        score={ar.sections.jd_match.score}
                        icon={Target}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-xs text-gray-500">
                              Seniority Match
                            </span>
                            <span className="text-xs font-bold text-gray-800 capitalize">
                              {ar.sections.jd_match.seniority_match}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Strengths
                              </p>
                              <StrengthList
                                items={ar.sections.jd_match.strengths}
                              />
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Weaknesses
                              </p>
                              <WeaknessList
                                items={ar.sections.jd_match.weaknesses}
                              />
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {/* NEGATIVES */}
                  {activeTab === "negatives" && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 mb-4">
                        All issues ranked by impact — fix in order from top to
                        bottom.
                      </p>
                      {ar.negative_points.map((neg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`rounded-2xl border p-5 ${severityStyle(neg.severity)}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/60">
                                #{neg.rank}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 capitalize">
                                {neg.severity}
                              </span>
                              <span className="text-[10px] opacity-40">·</span>
                              <span className="text-[10px] opacity-60">
                                {neg.section}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] opacity-60">
                                -{neg.score_impact} pts
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/60">
                                {neg.effort}
                              </span>
                            </div>
                          </div>
                          <h4 className="text-sm font-bold mb-1.5 text-gray-900">
                            {neg.issue}
                          </h4>
                          <p className="text-xs opacity-70 mb-3 leading-relaxed">
                            {neg.example}
                          </p>
                          <div className="flex gap-2 items-start bg-white/50 rounded-xl p-3">
                            <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-60" />
                            <p className="text-xs opacity-80 leading-relaxed">
                              {neg.fix}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* PROJECTS */}
                  {activeTab === "projects" && (
                    <div className="space-y-4">
                      {ar.projects.map((proj, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {proj.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-md border capitalize ${scoreBg(proj.score)}`}
                                >
                                  {proj.status.replace("_", " ")}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-md border ${proj.stack_relevance === "high" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                                >
                                  {proj.stack_relevance} relevance
                                </span>
                              </div>
                            </div>
                            <div className="text-center shrink-0">
                              <div
                                className="text-2xl font-black"
                                style={{ color: scoreColor(proj.score) }}
                              >
                                {proj.score}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                / 100
                              </div>
                            </div>
                          </div>

                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: scoreColor(proj.score),
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${proj.score}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Strengths
                              </p>
                              <StrengthList items={proj.strengths} />
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                Weaknesses
                              </p>
                              <WeaknessList items={proj.weaknesses} />
                            </div>
                          </div>

                          {proj.negative_flags.length > 0 && (
                            <>
                              <Divider />
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                                  Flags
                                </p>
                                <div className="space-y-2">
                                  {proj.negative_flags.map((f, j) => (
                                    <div
                                      key={j}
                                      className={`text-xs px-3 py-2 rounded-xl border flex items-start gap-2 ${severityStyle(f.impact)}`}
                                    >
                                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                      <div>
                                        <span className="font-medium">
                                          {f.flag}
                                        </span>
                                        <span className="opacity-60 ml-2">
                                          → {f.fix}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                              Suggested Improvement
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {proj.suggested_improvement}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* REWRITES */}
                  {activeTab === "rewrites" && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 mb-4">
                        AI-improved versions of weak bullets. Preserve your
                        actual experience — add your own metrics where
                        indicated.
                      </p>
                      {ar.bullet_rewrites.map((rw, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5"
                        >
                          <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-500">
                              {rw.section}
                            </span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                              {rw.company_or_project}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
                              <p className="text-[10px] text-red-500 uppercase tracking-wider mb-2 font-semibold">
                                Original
                              </p>
                              <p className="text-xs text-red-700 leading-relaxed italic">
                                "{rw.original}"
                              </p>
                              {rw.issues.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {rw.issues.map((iss, j) => (
                                    <span
                                      key={j}
                                      className="text-[10px] px-2 py-0.5 rounded-md bg-red-100 text-red-600"
                                    >
                                      {iss}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-center">
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                <TrendingUp className="w-3 h-3" />
                                <span>AI Rewrite</span>
                              </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-3.5">
                              <p className="text-[10px] text-green-600 uppercase tracking-wider mb-2 font-semibold">
                                Rewritten
                              </p>
                              <p className="text-xs text-green-800 leading-relaxed">
                                "{rw.rewritten}"
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {rw.why_better}
                            </p>
                          </div>

                          {rw.add_metric_here && (
                            <div className="mt-2 flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-200">
                              <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-amber-700 leading-relaxed">
                                Add your metric:{" "}
                                <span className="font-semibold">
                                  {rw.add_metric_here}
                                </span>
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* CHECKLIST */}
                  {activeTab === "checklist" && (
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-800">
                            Resume Checklist
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600 font-bold">
                              {ar.checklist.filter((c) => c.passed).length}{" "}
                              passed
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-red-500 font-bold">
                              {ar.checklist.filter((c) => !c.passed).length}{" "}
                              failed
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {ar.checklist.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                            >
                              {item.passed ? (
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700 leading-snug">
                                {item.check}
                              </p>
                              {!item.passed && item.tip && (
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                  {item.tip}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* INTERVIEW */}
                  {activeTab === "interview" && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 mb-4">
                        Predicted questions based on your resume and the JD.
                        Prepare STAR-format answers using your actual
                        experience.
                      </p>
                      {ar.interview_preparation.map(
                        (q: InterviewQuestion, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                          >
                            <div className="p-5 border-b border-gray-100">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="w-7 h-7 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0 text-xs font-black text-violet-600">
                                  {i + 1}
                                </div>
                                <span
                                  className={`text-[10px] px-2.5 py-1 rounded-lg font-medium capitalize ${difficultyStyle(q.difficulty)}`}
                                >
                                  {q.difficulty}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2">
                                "{q.question}"
                              </h3>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                {q.why_theyll_ask}
                              </p>
                            </div>
                            <div className="p-5 space-y-2.5">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">
                                STAR Outline
                              </p>
                              {Object.entries(q.star_outline).map(
                                ([key, val]) => (
                                  <div
                                    key={key}
                                    className="flex gap-3 items-start"
                                  >
                                    <span className="text-[10px] font-black uppercase text-gray-300 w-10 shrink-0 pt-0.5">
                                      {key[0]}
                                    </span>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                      {val}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="px-5 pb-5">
                              <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-xl p-3">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-700 leading-relaxed">
                                  <span className="font-semibold">
                                    Watch out:{" "}
                                  </span>
                                  {q.watch_out}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ),
                      )}
                    </div>
                  )}

                  {/* COMPANY FIT */}
                  {activeTab === "company" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5 text-violet-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {data.companyName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-500 capitalize">
                                {ar.company_intelligence.company_type}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-md border ${scoreBg(ar.company_intelligence.resume_style_fit === "strong" ? 85 : ar.company_intelligence.resume_style_fit === "moderate" ? 65 : 40)}`}
                              >
                                {ar.company_intelligence.resume_style_fit} fit
                              </span>
                            </div>
                          </div>
                        </div>

                        {ar.company_intelligence.culture_signals.length > 0 && (
                          <div className="mb-4">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                              Culture Signals
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {ar.company_intelligence.culture_signals.map(
                                (s, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-violet-700"
                                  >
                                    {s}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {ar.company_intelligence.company_specific_tips.length >
                          0 && (
                          <div className="mb-4">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                              Company-Specific Tips
                            </p>
                            <div className="space-y-2">
                              {ar.company_intelligence.company_specific_tips.map(
                                (tip, i) => (
                                  <div
                                    key={i}
                                    className="flex gap-2.5 items-start"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                      {tip}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {ar.company_intelligence.red_flags_for_this_company
                          .length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-[10px] text-red-600 uppercase tracking-wider mb-3 font-semibold">
                              Red Flags for {data.companyName}
                            </p>
                            <div className="space-y-2">
                              {ar.company_intelligence.red_flags_for_this_company.map(
                                (flag, i) => (
                                  <div
                                    key={i}
                                    className="flex gap-2.5 items-start"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-red-700 leading-relaxed">
                                      {flag}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
