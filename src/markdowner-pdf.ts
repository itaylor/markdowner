import { convert } from "@itaylor/pdf2square";
import { LLMClient, LLMOptions } from "./llm-client";

export async function pdf2md(
  pathToFile: string,
  options: LLMOptions,
): Promise<string> {
  // Convert PDF pages to base64 images using pdf2square
  const pdfPages = await convert(pathToFile, {
    maxPages: 20, // Reasonable limit for processing
    size: 896,
    dpi: 300,
    format: "png",
    bg: "#ffffff",
  });

  if (pdfPages.length === 0) {
    throw new Error("No pages found in PDF");
  }

  // Initialize LLM client
  const llmClient = LLMClient.create(options);

  // If no LLM configuration, just return extracted text
  if (!llmClient) {
    console.log("No LLM configuration provided, returning extracted text");
    return pdfPages.map((page) => page.extractedText).join("\n\n---\n\n");
  }

  const markdownSections: string[] = [];

  // Process each page with AI
  for (const page of pdfPages) {
    // Create prompt for this page
    const prompt = `You are converting from PDF to Markdown.  You are given both an image of the rendered PDF and the raw text extracted from the PDF file.
Here is the raw extracted text from the PDF page:
\`\`\`txt
${page.extractedText}
\`\`\`
Maintain the logical structure and hierarchy as much as possible so that the Markdown makes sense given the rendered version you see.
Make sure you include:
1. Any headings or titles you see
2. All text content in proper markdown formatting
3. Any tabular data in Github pipe style markdown table format

* For images, provide a brief description of what they represent instead of trying to make a Markdown link to them.
* For charts and graphs, attempt to transform them into tables, if sensible.  Otherwise describe the chart.

DO NOT return any extra text other than the Markdown, no comments or explanations about what you did.`;

    // Send request to LLM
    try {
      const response = await llmClient.generate({
        prompt: prompt,
        images: [page.base64EncodedImage.split("base64,")[1]],
      });

      if (response.content) {
        markdownSections.push(response.content);
      } else {
        // Fallback to extracted text
        if (page.extractedText.trim()) {
          markdownSections.push(page.extractedText);
        }
      }
    } catch (error) {
      console.warn(
        `Failed to process page with LLM: ${error}. Falling back to extracted text.`,
      );
      if (page.extractedText.trim()) {
        markdownSections.push(page.extractedText);
      }
    }
  }

  if (markdownSections.length === 0) {
    throw new Error("No pages could be processed successfully");
  }

  return markdownSections.join("\n\n---\n\n");
}
