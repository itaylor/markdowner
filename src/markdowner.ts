import { detectFormat } from './stereotype';
import { pdf2md } from './markdowner-pdf';
import { img2md } from './markdowner-image';
import { docx2md } from './markdowner-docx';
import { pptx2md } from './markdowner-pptx';
import { xlsx2md } from './markdowner-xlsx';
import { txt2md } from './markdowner-txt';
import { html2md } from './markdowner-html';
import { LLMOptions } from './llm-client';

export type { LLMOptions } from './llm-client';

export async function markdowner(
  pathToFile: string,
  options: LLMOptions,
): Promise<string> {
  const format = await detectFormat(pathToFile);

  let result = '';
  if (format === 'pdf') {
    result = await pdf2md(pathToFile, options);
  } else if (format === 'png' || format === 'jpg') {
    result = await img2md(pathToFile, options);
  } else if (format === 'docx') {
    result = await docx2md(pathToFile);
  } else if (format === 'pptx') {
    result = await pptx2md(pathToFile);
  } else if (format === 'xlsx') {
    result = await xlsx2md(pathToFile);
  } else if (format === 'html') {
    result = await html2md(pathToFile);
  } else if (format === 'txt' || format === 'md') {
    result = await txt2md(pathToFile);
  } else {
    throw new Error(`Unsupported file format: ${format}`);
  }
  return result;
}
