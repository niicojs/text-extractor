import { Document } from '@niicojs/word';

import { toUint8Array } from './utils.ts';

export async function extractFromWord(input: ArrayBuffer | Buffer) {
  const buffer = toUint8Array(input);
  const document = await Document.fromBuffer(buffer);
  const text = document.extractText();
  return text;
}
