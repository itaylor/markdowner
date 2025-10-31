import fs from 'node:fs';

export async function txt2md(pathToFile: string): Promise<string> {
  const content = await fs.promises.readFile(pathToFile, 'utf8');
  return content;
}
