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

**For AI features (optional):**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model and start server
ollama pull gemma2:27b
ollama serve
```

## CLI Usage

```bash
# Convert file to markdown
markdowner document.pdf

# Save to file
markdowner document.pdf -o output.md

# Disable AI (faster, basic extraction)
markdowner document.pdf --no-ollama

# Custom Ollama server
markdowner file.pdf --ollama-url http://remote:11434
```

## Library Usage

```javascript
import { markdowner } from 'markdowner';

// With AI enhancement
const markdown = await markdowner('./document.pdf', {
  ollamaUrl: 'http://localhost:11434'
});

// Without AI (faster, worse)
const markdown = await markdowner('./document.pdf', {
  ollamaUrl: null
});
```
