import { convert } from "pptx2md";

export async function pptx2md(pathToFile: string): Promise<string> {
  // Convert PPTX to markdown using pptx2md
  const markdown = await convert(pathToFile, {
    // Options for better conversion
    outputType: "text", // Output as plain text markdown
    imageOutputDir: null, // Don't save images separately, embed them
    splitSlides: false, // Keep all slides in one document
  });

  return markdown;
}
