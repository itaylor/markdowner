import { basename } from 'node:path';
import { LLMClient, LLMOptions } from './llm-client';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function img2md(
  pathToFile: string,
  options: LLMOptions,
): Promise<string> {
  // Check if file exists and is an image
  const ext = path.extname(pathToFile).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    throw new Error(
      `Unsupported image format: ${ext}. Only PNG and JPG are supported.`,
    );
  }

  // Read the image file and convert to base64
  const imageBuffer = await fs.readFile(pathToFile);
  const base64Image = imageBuffer.toString('base64');

  // Initialize LLM client
  const llmClient = LLMClient.create(options);

  if (!llmClient) {
    throw new Error('LLM configuration is required for image processing');
  }

  // Create the prompt for image description
  const prompt = `Analyze this image and convert it to markdown format. Include:
1. Summary of what you see in the image
2. Any text that appears in the image
3. Very short notes about unusual visual elements, colors, and composition
4. Format the output as clean, readable markdown
Return ONLY THE MARKDOWN, no additional comments, information, or prompts for further action`;

  // Send request to LLM with the image
  const response = await llmClient.generate({
    prompt: prompt,
    images: [base64Image],
  });

  if (!response.content) {
    throw new Error('Empty response from LLM');
  }

  return response.content;
}
