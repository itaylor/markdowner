// src/types/pptx-in-html-out.d.ts
declare module 'pptx-in-html-out' {
  import JSZip from 'jszip';
  import type { Metadata } from 'sharp';
  import type { Worker } from 'tesseract.js';

  export interface HtmlOptions {
    includeStyles?: boolean;
  }

  export interface SlideRelationships {
    [rId: string]: { Id: string; Target: string };
  }

  export interface Slide {
    file: string;
    content: any;
  }

  export interface ExtractedImage {
    data: string;
    metadata: Metadata;
    type?: string;
  }

  export type RelationshipsMap = Map<
    string,
    {
      [id: string]: { type: string; target: string };
    }
  >;

  export class PPTXInHTMLOut {
    pptxBuffer: Buffer;
    zip: JSZip | null;
    debug: boolean;
    ocrWorker: Worker | null;
    slideLayouts: Map<string, any>;
    slideMasters: Map<string, any>;
    slides: Slide[];
    images: Map<string, ExtractedImage>;
    relationships: RelationshipsMap;
    slideFiles?: string[];

    constructor(pptxBuffer: Buffer);
    setDebug(enabled: boolean): this;

    initialize(): Promise<void>;
    load(): Promise<void>;
    validatePPTX(): Promise<void>;
    parse(): Promise<void>;
    parseXml(content: string): Promise<any>;
    parseRelationships(): Promise<void>;
    parseSlides(): Promise<Slide[]>;
    convertSlideToHTML(slide: Slide): Promise<string>;
    convertShapeToHTML(
      shape: any,
      options?: Record<string, unknown>,
    ): Promise<string>;
    convertPictureToHTML(
      pic: any,
      options?: Record<string, unknown>,
    ): Promise<string>;
    getSlideRels(slideFile: string): Promise<SlideRelationships | null>;
    getImageData(slideFile: string, rId: string): Promise<Buffer | null>;
    processImage(imageBuffer: Buffer): Promise<{ text: string } | null>;
    convertShapeOrPicture(element: any): Promise<string | undefined>;
    parseSlideLayouts(): Promise<void>;
    parseSlideMasters(): Promise<void>;
    extractImages(): Promise<void>;
    toHTML(options?: HtmlOptions): Promise<string>;
    generateHTML(slides: Slide[], options?: HtmlOptions): Promise<string>;
    generateStyles(): string;
  }

  export default PPTXInHTMLOut;
}
