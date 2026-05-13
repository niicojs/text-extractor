import { extractText, getDocumentProxy } from 'unpdf';

import { toUint8Array } from './utils.ts';

export async function extractFromPdf(input: ArrayBuffer | Buffer) {
  const buffer = toUint8Array(input);
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}
