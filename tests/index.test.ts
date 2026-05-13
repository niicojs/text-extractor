import { zipSync } from 'fflate';
import { beforeEach, describe, expect, test, vi } from 'vite-plus/test';

import { extractFromPdf, extractFromPowerPoint, extractFromWord } from '../src/index.ts';

const { Document, extractText, getDocumentProxy } = vi.hoisted(() => ({
  Document: { fromBuffer: vi.fn() },
  extractText: vi.fn(),
  getDocumentProxy: vi.fn(),
}));

vi.mock('unpdf', () => ({ extractText, getDocumentProxy }));
vi.mock('@niicojs/word', () => ({ Document }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('extractFromPdf', () => {
  test('returns merged text from a PDF ArrayBuffer', async () => {
    const input = new Uint8Array([1, 2, 3]).buffer;
    const document = { numPages: 1 };
    getDocumentProxy.mockResolvedValue(document);
    extractText.mockResolvedValue({ text: 'PDF text' });

    await expect(extractFromPdf(input)).resolves.toBe('PDF text');

    expect(getDocumentProxy).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]));
    expect(extractText).toHaveBeenCalledWith(document, { mergePages: true });
  });

  test('passes only the Buffer slice bytes to unpdf', async () => {
    const input = Buffer.from([0, 1, 2, 3, 4]).subarray(1, 4);
    getDocumentProxy.mockResolvedValue({});
    extractText.mockResolvedValue({ text: 'sliced PDF text' });

    await extractFromPdf(input);

    expect(getDocumentProxy).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]));
  });
});

describe('extractFromWord', () => {
  test('returns raw text from a Word ArrayBuffer', async () => {
    const input = new Uint8Array([4, 5, 6]).buffer;
    const document = { extractText: vi.fn(() => 'Word text') };
    Document.fromBuffer.mockResolvedValue(document);

    await expect(extractFromWord(input)).resolves.toBe('Word text');

    expect(Document.fromBuffer).toHaveBeenCalledWith(new Uint8Array([4, 5, 6]));
    expect(document.extractText).toHaveBeenCalledOnce();
  });

  test('passes only the Buffer slice bytes to @niicojs/word', async () => {
    const input = Buffer.from([9, 8, 7, 6, 5]).subarray(1, 4);
    Document.fromBuffer.mockResolvedValue({ extractText: vi.fn(() => 'sliced Word text') });

    await extractFromWord(input);

    expect(Document.fromBuffer).toHaveBeenCalledWith(new Uint8Array([8, 7, 6]));
  });
});

describe('extractFromPowerPoint', () => {
  test('returns text from PPTX slides in slide order', async () => {
    const encoder = new TextEncoder();
    const input = zipSync({
      'ppt/slides/slide2.xml': encoder.encode('<p:sld><p:cSld><p:spTree><a:t>Second</a:t></p:spTree></p:cSld></p:sld>'),
      'ppt/slides/slide1.xml': encoder.encode(
        '<p:sld><p:cSld><p:spTree><a:t>First title</a:t><a:t>First body</a:t></p:spTree></p:cSld></p:sld>',
      ),
    });

    await expect(extractFromPowerPoint(Buffer.from(input))).resolves.toBe('First title\nFirst body\n\nSecond');
  });
});
