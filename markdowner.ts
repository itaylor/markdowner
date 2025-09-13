import { detectFormat } from "./stereotype";
import { pdf2md } from "./markdowner-pdf";
import { img2md } from "./markdowner-image";
import { docx2md } from "./markdowner-docx";
import { pptx2md } from "./markdowner-pptx";
import { xlsx2md } from "./markdowner-xlsx";
import { txt2md } from "./markdowner-txt";

export async function markdowner(
  pathToFile: string,
  options: {
    ollamaUrl: string | null;
  },
): Promise<string> {
  try {
    const format = await detectFormat(pathToFile);

    if (format === "pdf") {
      return await pdf2md(pathToFile, options);
    } else if (format === "png" || format === "jpg") {
      return await img2md(pathToFile, options);
    } else if (format === "docx") {
      return await docx2md(pathToFile);
    } else if (format === "pptx") {
      return await pptx2md(pathToFile);
    } else if (format === "xlsx") {
      return await xlsx2md(pathToFile);
    } else if (format === "txt" || format === "md") {
      return await txt2md(pathToFile);
    } else {
      throw new Error(`Unsupported file format: ${format}`);
    }
  } catch (error) {
    // Just rethrow to preserve stack traces
    throw error;
  }
}
