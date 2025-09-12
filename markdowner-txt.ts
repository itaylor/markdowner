import fs from "node:fs";

export async function txt2md(pathToFile: string): Promise<string> {
  // this returns the markdown representation of a txt file
  const content = await fs.promises.readFile(pathToFile, "utf8");
  return content;
}
