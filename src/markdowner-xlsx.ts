import { markdownTables } from "markdown-tables";

export async function xlsx2md(pathToFile: string): Promise<string> {
  // Use markdown-tables to convert xlsx to markdown
  const markdownTable = markdownTables(pathToFile);
  return markdownTable;
}
