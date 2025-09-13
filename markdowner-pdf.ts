import { convert } from "pdf2square";
import { Ollama } from "ollama";

export async function pdf2md(
  pathToFile: string,
  options: {
    ollamaUrl: string | null;
  },
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

  // If no Ollama URL, just return extracted text
  if (!options.ollamaUrl) {
    return pdfPages
      .map((page) => `## Page ${page.pageNumber}\n\n${page.extractedText}`)
      .join("\n\n---\n\n");
  }

  // Initialize Ollama client
  const ollama = new Ollama({
    host: options.ollamaUrl,
  });

  const markdownSections: string[] = [];

  // Process each page with AI
  for (const page of pdfPages) {
    // Extract base64 data from the data URL
    const base64Match = page.base64EncodedImage.match(
      /^data:image\/[^;]+;base64,(.+)$/,
    );
    if (!base64Match) {
      // Fallback to extracted text for this page
      if (page.extractedText.trim()) {
        markdownSections.push(
          `## Page ${page.pageNumber}\n\n${page.extractedText}`,
        );
      }
      continue;
    }

    const base64Image = base64Match[1];

    // Create prompt for this page
    const prompt = `Analyze this PDF page image and convert it to markdown format. Include:
1. Any headings or titles you see
2. All text content in proper markdown formatting
3. Descriptions of images, charts, or diagrams
4. Table data in markdown table format if present
5. Maintain the logical structure and hierarchy

Focus on accuracy and readability. Format as clean markdown:`;

    try {
      // Send request to Ollama
      const response = await ollama.generate({
        model: "gemma2:27b",
        prompt: prompt,
        images: [base64Image],
        stream: false,
      });

      if (response.response) {
        let pageContent = `## Page ${page.pageNumber}\n\n`;

        // Include extracted text as context comment if available
        if (page.extractedText.trim()) {
          pageContent += `<!-- Extracted text: ${page.extractedText.trim()} -->\n\n`;
        }

        pageContent += response.response;
        markdownSections.push(pageContent);
      } else {
        // Fallback to extracted text
        if (page.extractedText.trim()) {
          markdownSections.push(
            `## Page ${page.pageNumber}\n\n${page.extractedText}`,
          );
        }
      }
    } catch (pageError) {
      // Fallback to extracted text for this page
      if (page.extractedText.trim()) {
        markdownSections.push(
          `## Page ${page.pageNumber}\n\n${page.extractedText}`,
        );
      }
    }
  }

  if (markdownSections.length === 0) {
    throw new Error("No pages could be processed successfully");
  }

  return markdownSections.join("\n\n---\n\n");
}
