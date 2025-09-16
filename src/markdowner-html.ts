import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { readFile } from "node:fs/promises";
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { JSDOM } from "jsdom";

const turndownService = new TurndownService({ hr: "---" });
turndownService.use(gfm);
turndownService
  .remove("script")
  .remove("style")
  .remove("meta")
  .remove("link")
  .remove("head");

export async function html2md(pathToFile: string): Promise<string> {
  const content = await readFile(pathToFile, "utf8");
  const dom = new JSDOM(content);
  if (isProbablyReaderable(dom.window.document)) {
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (article?.content) {
      const markdown = turndownService.turndown(article.content);
      if (article.title) {
        return `# ${article.title}\n\n ${markdown}`;
      }
      return markdown;
    }
  }
  const markdown = turndownService.turndown(content);
  return markdown;
}

export async function htmlstr2md(htmlString: string): Promise<string> {
  const markdown = turndownService.turndown(htmlString);
  return markdown;
}
