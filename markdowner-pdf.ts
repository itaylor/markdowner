import { convert } from "pdf2square";
export function pdf2md(
  pathToFile: string,
  options: {
    ollamaUrl: string | null;
  },
): Promise<string> {
  const converted = await convert(pathToFile);
  if (options.ollamaUrl) {
    // This uses pdf2square to convert pdf's to square images, then
    // uses ollama with gemma3:27b to generate markdown from them.
    // It does a damn good job of getting the formatting and content
    // to match the original document.
    // TODO: Implement this!
  } else {
    // Without ollama, we just return the extracted text as markdown.  It
    // doesn't match the formatting at all, and may be empty if the pdf
    // was encoded as an image without the text data in the file.
    return converted.map(({ extractedText }) => extractedText).join("\n---\n");
  }
}
