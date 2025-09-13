import { basename } from "node:path";

import { Ollama } from "ollama";
import fs from "node:fs/promises";
import path from "node:path";

export async function img2md(
  pathToFile: string,
  options: {
    ollamaUrl: string | null;
  },
): Promise<string> {
  // Check if file exists and is an image
  const ext = path.extname(pathToFile).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) {
    throw new Error(
      `Unsupported image format: ${ext}. Only PNG and JPG are supported.`,
    );
  }

  // Read the image file and convert to base64
  const imageBuffer = await fs.readFile(pathToFile);
  const base64Image = imageBuffer.toString("base64");

  // Initialize Ollama client
  const ollama = new Ollama({
    host: options.ollamaUrl || "http://localhost:11434",
  });

  // Create the prompt for image description
  const prompt = `Analyze this image and convert it to markdown format. Include:
1. A brief descriptive title
2. Detailed description of what you see in the image
3. Any text that appears in the image
4. Key visual elements, colors, and composition
5. Format the output as clean, readable markdown

Please be thorough and descriptive while maintaining markdown formatting.`;

  // Send request to Ollama with the image
  const response = await ollama.generate({
    model: "gemma2:27b",
    prompt: prompt,
    images: [base64Image],
    stream: false,
  });

  if (!response.response) {
    throw new Error("Empty response from Ollama");
  }

  return response.response;
}
