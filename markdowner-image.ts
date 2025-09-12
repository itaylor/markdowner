import { basename } from "node:path";

export function img2md(
  pathToFile: string,
  options: {
    ollamaUrl: string | null;
  },
): Promise<string> {
  // this takes an image file in either png, or jpg format and then
  // uses ollama with gemma3:27b to generate markdown from them containing a description of what's in the image.
  if (!options.ollamaUrl) {
    return `![${basename(pathToFile)}](${pathToFile})`;
  }
}
