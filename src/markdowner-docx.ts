import { docx2md as helixDocx2md } from "@adobe/helix-docx2md";
import fs from "node:fs/promises";

export async function docx2md(pathToFile: string): Promise<string> {
  // Read the DOCX file as a buffer
  const buffer = await fs.readFile(pathToFile);

  // Convert DOCX to markdown using Adobe Helix
  const markdown = await helixDocx2md(buffer, {
    gridtables: false,
  });

  return markdown;
}
