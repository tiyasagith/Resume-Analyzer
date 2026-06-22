"use client";

import { useState } from "react";
import { useInngestAgent } from "@/hooks/useInngestAgent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Zap, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  success: boolean;
  analysis?: {
    overallScore: number;
    sections: any;
    structure: any;
    improvementPlan: any[];
    interviewPrep: any;
    recommendations: any[];
  };
  metadata?: {
    analysisType: string;
    processingTime: string;
    companyName: string;
    jobTitle: string;
  };
}

export const AIResumeAnalyzer = () => {
  const { triggerAIAnalysis, triggerOptimization } = useInngestAgent();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    resumeText: "",
    jobDescription: "",
    companyName: "",
    jobTitle: "",
    analysisType: "standard" as "quick" | "standard" | "deep",
    targetRole: "",
    targetCompany: ""
  });

  const handleAnalyze = async () => {
    if (!formData.resumeText || !formData.jobDescription || !formData.companyName || !formData.jobTitle) {
      toast.error("Please fill in all required fields for analysis");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await triggerAIAnalysis({
        resumeText: formData.resumeText,
        jobDescription: formData.jobDescription,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        analysisType: formData.analysisType
      });

      if (result.success) {
        toast.success("AI analysis started! This may take a few minutes...");
        
        // In a real app, you would set up event listeners or polling to get results
        // For demo purposes, we'll simulate a result after delay
        setTimeout(() => {
          setAnalysisResult({
            success: true,
            analysis: {
              overallScore: 78,
              sections: {
                ats_compatibility: { score: 85 },
                content_quality: { score: 72 },
                jd_match: { score: 75 }
              },
              structure: {
                totalLines: 150,
                hasQuantifiedMetrics: true,
                actionVerbs: 12
              },
              improvementPlan: [
                {
                  category: "Content Quality",
                  priority: "high",
                  issue: "Found 3 weak bullet points",
                  estimatedTime: "30-45 minutes"
                }
              ],
              interviewPrep: {
                totalQuestions: 8,
                questionsByDifficulty: { easy: 2, medium: 4, hard: 2 }
              },
              recommendations: [
                {
                  rank: 1,
                  severity: "high",
                  issue: "Add more quantifiable achievements",
                  fix: "Include specific metrics and numbers in your experience descriptions"
                }
              ]
            },
            metadata: {
              analysisType: formData.analysisType,
              processingTime: new Date().toISOString(),
              companyName: formData.companyName,
              jobTitle: formData.jobTitle
            }
          });
          setIsAnalyzing(false);
        }, 3000);
      } else {
        toast.error(result.error || "Failed to start analysis");
        setIsAnalyzing(false);
      }
    } catch (error) {
      toast.error("Failed to trigger analysis");
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!formData.resumeText || !formData.targetRole) {
      toast.error("Please provide resume text and target role for optimization");
      return;
    }

    setIsOptimizing(true);
    setOptimizationResult(null);

    try {
      const result = await triggerOptimization({
        resumeText: formData.resumeText,
        targetRole: formData.targetRole,
        targetCompany: formData.targetCompany
      });

      if (result.success) {
        toast.success("Resume optimization started! This may take a few minutes...");
        
        // Simulate optimization result
        setTimeout(() => {
          setOptimizationResult({
            success: true,
            currentState: {
              wordCount: 350,
              actionVerbRatio: 4.2,
              metricRatio: 1.8,
              sections: {
                hasSummary: false,
                hasExperience: true,
                hasSkills: true,
                hasEducation: true
              }
            },
            optimizations: {
              content: [
                {
                  type: "add_summary",
                  priority: "high",
                  suggestion: `Add a compelling professional summary for ${formData.targetRole} position`
                }
              ],
              ats: [
                {
                  type: "keyword_optimization",
                  priority: "high",
                  missingKeywords: ["leadership", "strategy"],
                  suggestion: "Incorporate these keywords: leadership, strategy"
                }
              ]
            },
            actionPlan: {
              immediateActions: [
                {
                  type: "add_summary",
                  priority: "high"
                }
              ],
              estimatedTotalTime: "2-4 hours"
            }
          });
          setIsOptimizing(false);
        }, 2500);
      } else {
        toast.error(result.error || "Failed to start optimization");
        setIsOptimizing(false);
      }
    } catch (error) {
      toast.error("Failed to trigger optimization");
      setIsOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          AI Resume Analyzer & Optimizer
        </h1>
        <p className="text-muted-foreground">
          Powered by Inngest AI AgentKit for intelligent resume analysis and optimization
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Analysis Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Resume Analysis
            </CardTitle>
            <CardDescription>
              Analyze your resume against a specific job description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Google"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Senior Frontend Developer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="analysisType">Analysis Depth</Label>
              <Select value={formData.analysisType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, analysisType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick (2-3 min)</SelectItem>
                  <SelectItem value="standard">Standard (5-7 min)</SelectItem>
                  <SelectItem value="deep">Deep (10-15 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                placeholder="Paste the full job description here..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="resumeText">Resume Text *</Label>
              <Textarea
                id="resumeText"
                value={formData.resumeText}
                onChange={(e) => setFormData(prev => ({ ...prev, resumeText: e.target.value }))}
                placeholder="Paste your resume text here..."
                rows={6}
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Start AI Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Optimization Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resume Optimization
            </CardTitle>
            <CardDescription>
              Get personalized suggestions to improve your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetRole">Target Role *</Label>
              <Input
                id="targetRole"
                value={formData.targetRole}
                onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <Label htmlFor="targetCompany">Target Company (Optional)</Label>
              <Input
                id="targetCompany"
                value={formData.targetCompany}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCompany: e.target.value }))}
                placeholder="Microsoft"
              />
            </div>

            <div>
              <Label htmlFor="resumeTextOpt">Resume Text *</Label>
              <Textarea
                id="resumeTextOpt"
                value={formData.resumeText}
                onChange={(e) => setFormData(prev => ({ ...prev, resumeText: e.target.value }))}
                placeholder="Paste your resume text here..."
                rows={8}
              />
            </div>

            <Button 
              onClick={handleOptimize} 
              disabled={isOptimizing}
              className="w-full"
              variant="outline"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimizing Resume...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Start AI Optimization
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Analysis for {analysisResult.metadata?.jobTitle} at {analysisResult.metadata?.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${getScoreColor(analysisResult.analysis?.overallScore || 0)}`}>
                  {analysisResult.analysis?.overallScore}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResult.analysis?.interviewPrep?.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Interview Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {analysisResult.analysis?.improvementPlan?.length}
                </div>
                <div className="text-sm text-muted-foreground">Improvement Areas</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Section Scores</h4>
              <div className="space-y-2">
                {Object.entries(analysisResult.analysis?.sections || {}).map(([section, data]: [string, any]) => (
                  <div key={section} className="flex justify-between items-center">
                    <span className="capitalize">{section.replace('_', ' ')}</span>
                    <span className={`font-semibold ${getScoreColor(data.score)}`}>{data.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Top Recommendations</h4>
              <div className="space-y-2">
                {analysisResult.analysis?.recommendations?.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant={getPriorityColor(rec.severity)} className="mt-0.5">
                      {rec.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{rec.issue}</p>
                      <p className="text-xs text-muted-foreground">{rec.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>
              Personalized suggestions to improve your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {optimizationResult.currentState?.wordCount}
                </div>
                <div className="text-sm text-muted-foreground">Word Count</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {optimizationResult.currentState?.actionVerbRatio.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Action Verbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {optimizationResult.currentState?.metricRatio.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Metrics</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Content Optimizations</h4>
              <div className="space-y-2">
                {optimizationResult.optimizations?.content?.map((opt: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getPriorityColor(opt.priority)}>{opt.priority}</Badge>
                      <span className="font-medium">{opt.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm">{opt.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Action Plan</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Immediate Actions</span>
                  <Badge variant="destructive">
                    {optimizationResult.actionPlan?.immediateActions?.length} tasks
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated time: {optimizationResult.actionPlan?.estimatedTotalTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
