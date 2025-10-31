#!/usr/bin/env node

import { Command } from 'commander';
import { markdowner } from './markdowner.js';
import path from 'node:path';
import fs from 'node:fs/promises';

const program = new Command()
  .name('markdowner')
  .description(
    'Convert various file formats to markdown using AI and specialized converters',
  )
  .argument('<file>', 'Input file to convert to markdown')
  .option(
    '--ollama-url <url>',
    'Ollama server URL for AI-powered conversions (legacy)',
    'http://localhost:11434',
  )
  .option(
    '--openai-base-url <url>',
    'OpenAI-compatible API base URL (e.g., http://localhost:11434/v1 for Ollama)',
  )
  .option('--openai-api-key <key>', 'API key for OpenAI-compatible endpoint')
  .option(
    '--openai-model <model>',
    'Model name for OpenAI-compatible endpoint',
    'gpt-4-vision-preview',
  )
  .option('-o, --output <file>', 'Output file (default: print to stdout)')
  .option(
    '--no-ai',
    'Disable AI-powered conversions (fallback to basic text extraction)',
  )
  .option(
    '--no-ollama',
    'Disable AI-powered conversions (legacy alias for --no-ai)',
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
    const options = {};

    // Check if AI is disabled
    const aiDisabled = opts.noAi || opts.noOllama;

    if (!aiDisabled) {
      // Check for OpenAI-compatible configuration
      if (opts.openaiBaseUrl) {
        if (!opts.openaiApiKey) {
          console.error(
            '❌ Error: --openai-api-key is required when using --openai-base-url',
          );
          process.exit(1);
        }
        options.openai = {
          baseURL: opts.openaiBaseUrl,
          apiKey: opts.openaiApiKey,
          model: opts.openaiModel,
        };
      } else if (opts.ollamaUrl) {
        // Legacy Ollama configuration
        options.ollamaUrl = opts.ollamaUrl;
      } else {
        // Default to local Ollama for backward compatibility
        options.ollamaUrl = 'http://localhost:11434';
      }
    }

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
    console.error('❌ Error:', error.message || error);

    // Provide helpful error messages
    if (
      error.message?.includes('LLM') ||
      error.message?.includes('Ollama') ||
      error.message?.includes('OpenAI')
    ) {
      console.error('\n💡 Tips:');
      console.error(
        '- For Ollama: Make sure Ollama is running (ollama serve) and model is available (ollama list)',
      );
      console.error(
        '- For OpenAI: Check your API key and base URL are correct',
      );
      console.error('- Try with --no-ai to disable AI features');
    } else if (error.message?.includes('Unsupported file format')) {
      console.error('\n💡 Supported formats:');
      console.error('- PDF (.pdf)');
      console.error('- Images (.png, .jpg, .jpeg)');
      console.error('- Word documents (.docx)');
      console.error('- PowerPoint (.pptx)');
      console.error('- Excel (.xlsx)');
      console.error('- Text files (.txt, .md)');
    }

    process.exit(1);
  }
})();
