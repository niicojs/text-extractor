# @niicojs/text-extractor

Text extraction helpers for Node.js. Supports PDF, Word, and PowerPoint files from `ArrayBuffer` or Node `Buffer`
inputs.

## Install

```sh
pnpm add @niicojs/text-extractor
```

## Usage

```ts
import { readFile } from 'node:fs/promises';

import { extractFromPdf, extractFromPowerPoint, extractFromWord } from '@niicojs/text-extractor';

const pdfBuffer = await readFile('document.pdf');
const pdfText = await extractFromPdf(pdfBuffer);

const docxBuffer = await readFile('document.docx');
const wordText = await extractFromWord(docxBuffer);

const pptxBuffer = await readFile('presentation.pptx');
const powerPointText = await extractFromPowerPoint(pptxBuffer);
```

## API

### `extractFromPdf(buffer: ArrayBuffer | Buffer)`

Extracts merged text from a PDF using `unpdf`.

### `extractFromWord(buffer: ArrayBuffer | Buffer)`

Extracts text from a Word document using `@niicojs/word`.

### `extractFromPowerPoint(buffer: ArrayBuffer | Buffer)`

Extracts text from PowerPoint slides in slide order. Text runs within the same slide are separated by newlines, and
slides are separated by blank lines.

## Development

Use Vite+ (`vp`) for project commands.

```sh
vp install
vp check
vp test
vp pack
```

- `vp check --fix` fixes formatting and lint issues.
- `vp test run tests/index.test.ts` runs one test file.
- `vp pack --watch` builds in watch mode.

## Tests

The test suite covers the public extractors and verifies that sliced `Buffer` inputs pass only their visible bytes to the
underlying parsers.
