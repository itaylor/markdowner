import { test, describe, before } from "node:test";
import { strict as assert } from "node:assert";
import { markdowner } from "../markdowner";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { rmSync, mkdirSync, writeFileSync, existsSync } from "node:fs";

const fixturesDir = join(__dirname, "../../", "fixtures", "basic");
const outputDir = join(__dirname, "output");
console.log(outputDir);

const OLLAMA_URL = "http://localhost:11434";

// Helper function to write output file
function writeOutputFile(filename: string, content: string): void {
  const filePath = join(outputDir, filename);
  writeFileSync(filePath, content, "utf-8");
}

describe("markdowner basic functionality", () => {
  before(() => {
    // Clear and recreate output directory
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true, force: true });
    }
    mkdirSync(outputDir, { recursive: true });
  });

  test("should process Excel file (.xlsx)", async () => {
    const filename = "bigfoot_sightings_10yr_enhanced.xlsx";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    assert(
      result.toLowerCase().includes("sightings"),
      'Expected result to contain "sightings"',
    );
  });

  test("should process PowerPoint file (.pptx)", async () => {
    const filename = "cornflakes_vs_rice_chex.pptx";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    const lowerResult = result.toLowerCase();
    assert(
      lowerResult.includes("corn flakes") || lowerResult.includes("cornflakes"),
      'Expected result to contain "corn flakes" or "cornflakes"',
    );
    assert(lowerResult.includes("rice"), 'Expected result to contain "rice"');
    assert(lowerResult.includes("chex"), 'Expected result to contain "chex"');
  });

  test("should process JPEG image (.jpg)", async () => {
    const filename = "fresh-ass-undies.jpg";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    assert(
      result.toLowerCase().includes("activated carbon"),
      'Expected result to contain "activated carbon"',
    );
  });

  test("should process PNG image (.png)", async () => {
    const filename = "fresh_ass_undies_text_thread.png";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    assert(
      result.toLowerCase().includes("activated carbon"),
      'Expected result to contain "activated carbon"',
    );
  });

  test("should process Word document (.docx)", async () => {
    const filename = "grapefruit_vs_lime.docx";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    const lowerResult = result.toLowerCase();
    assert(
      lowerResult.includes("grapefruit"),
      'Expected result to contain "grapefruit"',
    );
    assert(lowerResult.includes("lime"), 'Expected result to contain "lime"');
  });

  test("should process PDF document (.pdf)", async () => {
    const filename = "hairgrowth_machine_brochure_overdrive.pdf";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    const lowerResult = result.toLowerCase();
    assert(lowerResult.includes("hair"), 'Expected result to contain "hair"');
    assert(
      lowerResult.includes("growth"),
      'Expected result to contain "growth"',
    );
  });

  test("should process HTML file (.html)", async () => {
    const filename = "late_90s_blog_homepage.html";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(
      result.length > 100,
      "Expected substantial content from HTML conversion",
    );
    assert(
      result.includes("StarTrekSad.com"),
      'Expected result to contain "StarTrekSad.com"',
    );
    assert(
      result.includes("Captain's Log"),
      'Expected result to contain "Captain\'s Log"',
    );
    assert(result.includes("Seattle"), 'Expected result to contain "Seattle"');
  });

  test("should process Markdown file (.md)", async () => {
    const filename = "maple_syrup.md";
    const filePath = join(fixturesDir, filename);

    const result = await markdowner(filePath, {
      ollamaUrl: OLLAMA_URL,
    });

    // Write output to file
    writeOutputFile(`${filename}.md`, result);

    // Assertions
    assert(typeof result === "string", "Expected result to be a string");
    assert(result.length > 0, "Expected non-empty result");
    assert(
      result.includes("Why I Use Maple Syrup"),
      'Expected result to contain "Why I Use Maple Syrup"',
    );
    assert(
      result.includes("Big Sugar"),
      'Expected result to contain "Big Sugar"',
    );
    assert(
      result.includes("Recipe: Maple Chocolate Chip Cookies"),
      'Expected result to contain "Recipe: Maple Chocolate Chip Cookies"',
    );
    const lowerResult = result.toLowerCase();
    assert(
      lowerResult.includes("maple syrup"),
      'Expected result to contain "maple syrup"',
    );
    assert(
      lowerResult.includes("refined sugar"),
      'Expected result to contain "refined sugar"',
    );
    assert(
      lowerResult.includes("sweetener"),
      'Expected result to contain "sweetener"',
    );
  });

  test("should throw error for unsupported file format", async () => {
    const fakePath = join(fixturesDir, "fake.unsupported");

    await assert.rejects(async () => {
      await markdowner(fakePath, { ollamaUrl: OLLAMA_URL });
    }, /Unsupported file format/);
  });
});
