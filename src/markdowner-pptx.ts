import fs from "fs/promises";
import { PPTXInHTMLOut } from "pptx-in-html-out";
import { htmlstr2md } from "./markdowner-html";

export async function pptx2md(pathToFile: string): Promise<string> {
  // Read your PPTX file into a buffer
  const pptxBuffer = await fs.readFile(pathToFile);
  // Create converter instance with buffer
  const converter = new PPTXInHTMLOut(pptxBuffer);
  await converter.initialize();
  const slides = await converter.parseSlides();
  //convert each slide separately
  const mds = await Promise.all(
    slides.map(async (slide) => {
      const slideHTML = await converter.generateHTML([slide], {
        includeStyles: true,
      });
      const slideMd = await htmlstr2md(slideHTML);
      return slideMd;
    }),
  );
  return mds.join("\n\n---\n\n");
}
