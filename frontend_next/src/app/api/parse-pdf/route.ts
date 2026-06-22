import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set the worker path explicitly for Node.js environment
    // We try to use the worker from pdf-parse's own node_modules to ensure version compatibility
    let workerPath = path.resolve(
      process.cwd(),
      "node_modules/pdf-parse/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
    );
    
    // Fallback if not nested (depends on npm/yarn/pnpm flattening)
    if (!fs.existsSync(workerPath)) {
      workerPath = path.resolve(
        process.cwd(),
        "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
      );
    }

    const workerUrl = pathToFileURL(workerPath).toString();
    PDFParse.setWorker(workerUrl);

    // Mehmet Kozan's pdf-parse (v2+) uses a class-based API
    const parser = new PDFParse({ data: buffer });
    
    const textData = await parser.getText();
    const infoData = await parser.getInfo();
    
    // Cleanup
    await parser.destroy();

    return NextResponse.json({
      text: textData.text,
      pages: textData.total,
      info: infoData.info,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      {
        error: "PDF parsing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
