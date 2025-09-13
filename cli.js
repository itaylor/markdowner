#!/usr/bin/env node

import { Command } from "commander";
import { markdowner } from "./markdowner.js";
import path from "node:path";
import fs from "node:fs/promises";

const program = new Command()
  .name("markdowner")
  .description("Convert various file formats to markdown using AI and specialized converters")
  .argument("<file>", "Input file to convert to markdown")
  .option(
    "--ollama-url <url>",
    "Ollama server URL for AI-powered conversions",
    "http://localhost:11434"
  )
  .option(
    "-o, --output <file>",
    "Output file (default: print to stdout)"
  )
  .option(
    "--no-ollama",
    "Disable AI-powered conversions (fallback to basic text extraction)"
  )
  .showHelpAfterError()
  .parse();

const opts = program.opts();
const [inputFile] = program.args;

(async () => {
  try {
    // Resolve input file path
    const filePath = path.resolve(inputFile);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    // Prepare options
    const options = {
      ollamaUrl: opts.noOllama ? null : (opts.ollamaUrl || "http://localhost:11434")
    };

    console.error(`🔄 Converting ${path.basename(filePath)} to markdown...`);

    // Convert file to markdown
    const markdown = await markdowner(filePath, options);

    // Output result
    if (opts.output) {
      const outputPath = path.resolve(opts.output);
      await fs.writeFile(outputPath, markdown, 'utf8');
      console.error(`✅ Markdown saved to: ${outputPath}`);
    } else {
      // Print to stdout
      console.log(markdown);
    }

  } catch (error) {
    console.error("❌ Error:", error.message || error);

    // Provide helpful error messages
    if (error.message?.includes("Ollama")) {
      console.error("\n💡 Tips:");
      console.error("- Make sure Ollama is running: ollama serve");
      console.error("- Check if the model is available: ollama list");
      console.error("- Try with --no-ollama to disable AI features");
    } else if (error.message?.includes("Unsupported file format")) {
      console.error("\n💡 Supported formats:");
      console.error("- PDF (.pdf)");
      console.error("- Images (.png, .jpg, .jpeg)");
      console.error("- Word documents (.docx)");
      console.error("- PowerPoint (.pptx)");
      console.error("- Excel (.xlsx)");
      console.error("- Text files (.txt, .md)");
    }

    process.exit(1);
  }
})();
