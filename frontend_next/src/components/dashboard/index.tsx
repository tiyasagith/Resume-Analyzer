"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import {
  Plus,
  FileText,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart2,
  Star,
} from "lucide-react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  overallScore: number;
  fileName: string;
  createdAt: string;
}

// ─── Score Helpers ────────────────────────────────────────────────────────────

const scoreColor = (s: number) =>
  s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : s >= 40 ? "#2563eb" : "#dc2626";

const scoreBgClass = (s: number) =>
  s >= 80
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : s >= 60
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : s >= 40
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-red-50 text-red-700 border-red-200";

const scoreLabel = (s: number) =>
  s >= 80 ? "Strong" : s >= 60 ? "Good" : s >= 40 ? "Fair" : "Weak";

// ─── Mini Score Arc ───────────────────────────────────────────────────────────

const ScoreArc = ({ score }: { score: number }) => {
  const size = 56;
  const stroke = 5;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  const cx = size / 2;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-sm leading-none" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
      </div>
      <div className="w-14 h-14 bg-gray-100 rounded-full ml-3" />
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-gray-100 rounded w-full" />
      <div className="h-2 bg-gray-100 rounded w-5/6" />
      <div className="h-2 bg-gray-100 rounded w-4/6" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
  </div>
);

// ─── Resume Mock Lines ────────────────────────────────────────────────────────

const MockLines = ({ score }: { score: number }) => {
  const accent = scoreColor(score);
  return (
    <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2 overflow-hidden">
      {/* Name line */}
      <div
        className="h-2.5 rounded-full w-2/5"
        style={{ background: `${accent}30` }}
      />
      <div className="h-1.5 bg-gray-200 rounded-full w-full" />
      <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
      <div className="h-1.5 bg-gray-100 rounded-full w-3/5" />
      <div
        className="mt-3 h-2 rounded-full w-1/3"
        style={{ background: `${accent}25` }}
      />
      <div className="h-1.5 bg-gray-200 rounded-full w-full" />
      <div className="h-1.5 bg-gray-200 rounded-full w-5/6" />
    </div>
  );
};

// ─── Application Card ─────────────────────────────────────────────────────────

const AppCard = ({ app, index }: { app: Application; index: number }) => {
  const color = scoreColor(app.overallScore);
  const label = scoreLabel(app.overallScore);
  const badgeClass = scoreBgClass(app.overallScore);
  const date = new Date(app.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link href={`/review/${app.id}`}>
        <div
          className="group relative rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden"
          style={{ "--score-color": color } as React.CSSProperties}
        >
          {/* Subtle top accent strip */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: color }}
          />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                {app.companyName}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5 truncate">
                {app.jobTitle}
              </p>
            </div>
            <ScoreArc score={app.overallScore} />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}
            >
              {label}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-400 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {date}
            </span>
          </div>

          {/* Mock resume preview */}
          <MockLines score={app.overallScore} />

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-gray-300" />
              <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                {app.fileName}
              </span>
            </div>
            <div
              className="flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
              style={{ color }}
            >
              View Analysis
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBar = ({ apps }: { apps: Application[] }) => {
  if (!apps || apps.length === 0) return null;

  const avg = Math.round(
    apps.reduce((a, b) => a + b.overallScore, 0) / apps.length,
  );
  const best = Math.max(...apps.map((a) => a.overallScore));
  const strong = apps.filter((a) => a.overallScore >= 80).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-3 gap-3 mb-8"
    >
      {[
        {
          label: "Avg Score",
          value: `${avg}`,
          icon: BarChart2,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        },
        {
          label: "Best Score",
          value: `${best}`,
          icon: Star,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
        },
        {
          label: "Strong Resumes",
          value: `${strong}/${apps.length}`,
          icon: TrendingUp,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border ${stat.border} ${stat.bg} p-4 flex items-center gap-3`}
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div className="min-w-0">
            <div className={`text-xl font-black leading-none ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardComponent({ loading }: { loading: boolean }) {
  const resumeData = useSelector((state: any) => state.dashboard.AllResumeData);

  const hasData = Array.isArray(resumeData) && resumeData.length > 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* ── Hero Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-10"
            >
              {/* Top pill */}
              <div className="flex justify-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 bg-violet-50 text-violet-600 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Resume Intelligence
                </div>
              </div>

              {/* Heading */}
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-3">
                  Your Application{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">
                      Dashboard
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 opacity-40" />
                  </span>
                </h1>
                <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-7 leading-relaxed">
                  Track every submission, get AI feedback, and improve your
                  resume score over time.
                </p>
                <Link href="/upload">
                  <button className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:shadow-gray-900/30 active:scale-[0.98] transition-all duration-200">
                    <Plus className="w-4 h-4" />
                    Upload New Resume
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* ── Stats Bar (only when has data) ── */}
            {!loading && hasData && <StatsBar apps={resumeData} />}

            {/* ── Section label ── */}
            {!loading && hasData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-4"
              >
                <h2 className="text-sm font-semibold text-gray-700">
                  All Analyses
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({resumeData.length}{" "}
                    {resumeData.length === 1 ? "resume" : "resumes"})
                  </span>
                </h2>
                <span className="text-[10px] text-gray-400">
                  Click a card to view full report
                </span>
              </motion.div>
            )}

            {/* ── Cards Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {loading ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </>
              ) : !hasData ? (
                /* ── Empty State ── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-full"
                >
                  <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-5">
                      <FileText className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                      No resumes yet
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-7">
                      Upload your first resume and get an instant AI-powered
                      analysis tailored to your target role.
                    </p>
                    <Link href="/upload">
                      <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-md shadow-gray-900/15">
                        <Plus className="w-4 h-4" />
                        Upload First Resume
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                resumeData.map((app: Application, i: number) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
