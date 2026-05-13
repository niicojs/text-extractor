import { beforeEach, describe, expect, test, vi } from 'vite-plus/test';

import { extractFromPdf, extractFromWord } from '../src/index.ts';

const { extractRawText, extractText, getDocumentProxy } = vi.hoisted(() => ({
  extractRawText: vi.fn(),
  extractText: vi.fn(),
  getDocumentProxy: vi.fn(),
}));

vi.mock('unpdf', () => ({ extractText, getDocumentProxy }));
vi.mock('mammoth', () => ({ extractRawText }));

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
    extractRawText.mockResolvedValue({ value: 'Word text' });

    await expect(extractFromWord(input)).resolves.toBe('Word text');

    expect(extractRawText).toHaveBeenCalledWith({ arrayBuffer: input });
  });

  test('passes only the Buffer slice bytes to mammoth', async () => {
    const input = Buffer.from([9, 8, 7, 6, 5]).subarray(1, 4);
    extractRawText.mockResolvedValue({ value: 'sliced Word text' });

    await extractFromWord(input);

    const [{ arrayBuffer }] = extractRawText.mock.calls[0];
    expect(new Uint8Array(arrayBuffer)).toEqual(new Uint8Array([8, 7, 6]));
  });
});
