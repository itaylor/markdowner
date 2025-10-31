import { fileTypeFromFile } from 'file-type';
import path from 'node:path';

const formats = [
  'pdf',
  'png',
  'jpg',
  'docx',
  'pptx',
  'xlsx',
  'txt',
  'csv',
  'html',
  'md',
  'unknown',
] as const;
export type FileFormat = (typeof formats)[number];

export async function detectFormat(filePath: string): Promise<FileFormat> {
  const ft = await fileTypeFromFile(filePath);

  if (ft && ft.ext && formats.includes(ft.ext as any)) {
    // file-type already identified a concrete binary/OOXML type
    return ft.ext as FileFormat;
  }

  // file-type says "txt" (or couldn't identify) — use the extension as the tiebreaker
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv') return 'csv';
  if (ext === '.txt') return 'txt';
  if (ext === '.html' || ext === '.htm') return 'html';
  if (ext === '.md') return 'md';

  // fall back if unrecognized
  return 'unknown';
}
