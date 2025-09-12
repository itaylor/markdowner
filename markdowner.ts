import { detectFormat } from "./stereotype";
import { pdf2md } from "./markdowner-pdf";
import { img2md } from "./markdowner-image";

export async function markdowner(
  pathToFile: string,
  options: {
    ollamaUrl: string | null;
  },
): string {
  const format = await detectFormat(pathToFile);
  if (format === "txt") {
  } else if (format === "pdf") {
    return pdf2md(pathToFile, options);
  } else if (format === "png" || format === "jpg") {
    return img2md(pathToFile, options);
  } else if (format === "docx") {
    return docx2md(pathToFile, options);
  } else if (format === "pptx") {
    return pptx2md(pathToFile, options);
  } else if (format === "xlsx") {
    return xlsx2md(pathToFile, options);
  } else if (format === "txt" || format === "md") {
    return txt2md(pathToFile, options);
  } else {
    throw new Error(`Unsupported file format: ${format}`);
  }
}
