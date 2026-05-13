import { extractRawText } from 'mammoth';

import { toArrayBuffer } from './utils.ts';

export async function extractFromWord(input: ArrayBuffer | Buffer) {
  const arrayBuffer = input instanceof ArrayBuffer ? input : toArrayBuffer(input);
  const text = await extractRawText({ arrayBuffer });
  return text.value;
}
