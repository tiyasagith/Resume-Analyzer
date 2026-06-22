import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resumeAnalyzer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Call the server-side AI utility
    const result = await analyzeResume(body);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Analysis API error:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Failed to analyze resume. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
