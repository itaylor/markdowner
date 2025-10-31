# Markdowner

Convert various file formats to markdown using AI and specialized converters.

## Supported Formats

- **PDF** (.pdf) - AI-powered conversion with image analysis
- **Images** (.png, .jpg, .jpeg) - AI vision model describes content
- **Word** (.docx) - Direct conversion
- **PowerPoint** (.pptx) - Extract slides and content
- **Excel** (.xlsx) - Convert to markdown tables
- **Text** (.txt, .md) - Pass-through

## Requirements

**For AI features (choose one):**

**Option 1: OpenAI (or compatible services):**

```bash
# Get API key from OpenAI, or use any OpenAI-compatible service
export OPENAI_API_KEY="your-api-key-here"
```

**Option 2: Ollama (local):**

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model and start server
ollama pull gemma2:27b
ollama serve
```

## CLI Usage

```bash
# Convert file to markdown (uses local Ollama by default)
markdowner document.pdf

# Save to file
markdowner document.pdf -o output.md

# Use OpenAI
markdowner document.pdf \
  --openai-base-url https://api.openai.com/v1 \
  --openai-api-key $OPENAI_API_KEY \
  --openai-model gpt-4-vision-preview

# Use Ollama on remote server
markdowner document.pdf \
  --openai-base-url http://remote:11434/v1 \
  --openai-api-key ollama \
  --openai-model gemma2:27b

# Legacy Ollama syntax (still supported)
markdowner file.pdf --ollama-url http://localhost:11434

# Disable AI (faster, basic extraction for pdfs, images will throw)
markdowner document.pdf --no-ai
```

## Library Usage

```javascript
import { markdowner } from 'markdowner';

// With OpenAI
const markdown = await markdowner('./document.pdf', {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-vision-preview',
  },
});

// With Ollama using OpenAI-compatible API
const markdown = await markdowner('./document.pdf', {
  openai: {
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama', // required but unused
    model: 'gemma2:27b',
  },
});

// Legacy Ollama syntax (still supported)
const markdown = await markdowner('./document.pdf', {
  ollamaUrl: 'http://localhost:11434',
});

// Without AI (faster, basic extraction only)
const markdown = await markdowner('./document.pdf', {});
```
