import { extractFromPdf } from './pdf.ts';
import { extractFromPowerPoint } from './powerpoint.ts';
import { extractFromWord } from './word.ts';

export { extractFromPdf, extractFromPowerPoint, extractFromWord };

export async function extractText(input: ArrayBuffer | Buffer, ext: 'pdf' | 'pptx' | 'docx' | 'txt') {
  switch (ext) {
    case 'pdf':
      return extractFromPdf(input);
    case 'pptx':
      return extractFromPowerPoint(input);
    case 'docx':
      return extractFromWord(input);
    case 'txt':
      return new TextDecoder().decode(input);
    default:
      throw new Error(`Unsupported file type: ${ext as string}`);
  }
}
