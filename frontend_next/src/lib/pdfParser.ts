export interface ParsedPDF {
  text: string;
  numPages: number;
  metadata?: any;
}

// Parse PDF using backend API route (pdf-parse only works in Node.js)
export const parsePDFSimple = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.text;
  } catch (error) {
    console.error("Error parsing PDF with API:", error);
    throw new Error("Failed to parse PDF file");
  }
};
