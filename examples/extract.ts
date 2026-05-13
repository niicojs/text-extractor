import { readdirSync, readFileSync } from 'node:fs';

import { extractFromPdf, extractFromPowerPoint, extractFromWord } from '../src/index.ts';

for (const file of readdirSync('./data')) {
  const content = readFileSync(`./data/${file}`);
  const ext = file.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    console.log(`Extracting text from PDF file: ${file}`);
    const text = await extractFromPdf(content);
    console.log(`Extracted text from ${file}:\n${text}\n`);
  } else if (ext === 'docx') {
    console.log(`Extracting text from DOCX file: ${file}`);
    const text = await extractFromWord(content);
    console.log(`Extracted text from ${file}:\n${text}\n`);
  } else if (ext === 'pptx') {
    console.log(`Extracting text from PPTX file: ${file}`);
    const text = await extractFromPowerPoint(content);
    console.log(`Extracted text from ${file}:\n${text}\n`);
  } else {
    console.log(`Unsupported file type: ${file}`);
  }
}
