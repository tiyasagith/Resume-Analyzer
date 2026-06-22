import { NextRequest, NextResponse } from "next/server";
import { uploadPDFToImageKit } from "@/lib/imagekit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "resumes";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Call the server-side utility
    const result = await uploadPDFToImageKit(file, folder);

    return NextResponse.json(result);
  } catch (error) {
    console.error("ImageKit upload API error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
