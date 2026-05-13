import { XMLParser } from 'fast-xml-parser';
import { unzipSync } from 'fflate';

import { toUint8Array } from './utils.ts';

const textDecoder = new TextDecoder();

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  removeNSPrefix: true,
  trimValues: false,
});

function appendTextValue(value: unknown, output: string[]) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    output.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) appendTextValue(item, output);
    return;
  }

  if (!value || typeof value !== 'object') return;

  const text = (value as Record<string, unknown>)['#text'];
  if (text !== undefined) appendTextValue(text, output);
}

function collectText(value: unknown, output: string[]) {
  if (Array.isArray(value)) {
    for (const item of value) collectText(item, output);
    return;
  }

  if (!value || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  if ('t' in record) appendTextValue(record.t, output);
  for (const [key, item] of Object.entries(record)) {
    if (key !== 't') collectText(item, output);
  }
}

function slideIndex(path: string) {
  return Number(path.match(/^ppt\/slides\/slide(\d+)\.xml$/)?.[1] ?? 0);
}

export async function extractFromPowerPoint(input: ArrayBuffer | Buffer) {
  const zip = unzipSync(toUint8Array(input));
  const slidePaths = Object.keys(zip)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => slideIndex(a) - slideIndex(b));

  const slides: string[] = [];

  for (const slidePath of slidePaths) {
    const slide = parser.parse(textDecoder.decode(zip[slidePath]));
    const text: string[] = [];
    collectText(slide, text);
    if (text.length > 0) slides.push(text.join('\n'));
  }

  return slides.join('\n\n');
}
