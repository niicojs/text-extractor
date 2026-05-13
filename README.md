# @niicojs/text-extractor

Text extraction helpers for Node.js.

## Install

```sh
pnpm add @niicojs/text-extractor
```

## Usage

```ts
import { readFile } from 'node:fs/promises';

import { extractFromPdf, extractFromWord } from '@niicojs/text-extractor';

const pdfBuffer = await readFile('document.pdf');
const pdfText = await extractFromPdf(pdfBuffer);

const docxBuffer = await readFile('document.docx');
const wordText = await extractFromWord(docxBuffer);
```

## API

### `extractFromPdf(buffer: ArrayBuffer | Buffer)`

Extracts merged text from a PDF using `unpdf`.

### `extractFromWord(buffer: ArrayBuffer | Buffer)`

Extracts raw text from a Word document using `mammoth`.

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
