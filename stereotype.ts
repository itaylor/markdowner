import { fileTypeFromFile } from "file-type";
import path from "node:path";

/**
 * Returns one of:
 * pdf | png | jpg | docx | pptx | xlsx | txt | csv | unknown
 */
export async function detectFormat(filePath) {
  const ft = await fileTypeFromFile(filePath);

  if (ft?.ext && ft.ext !== "txt") {
    // file-type already identified a concrete binary/OOXML type
    return ft.ext; // e.g., 'pdf', 'png', 'jpg', 'docx', 'pptx', 'xlsx'
  }

  // file-type says "txt" (or couldn't identify) — use the extension as the tiebreaker
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".csv") return "csv";
  if (ft?.ext === "txt") return "txt";

  // fall back if unrecognized
  return "unknown";
}
