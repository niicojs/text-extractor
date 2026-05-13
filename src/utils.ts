function sharedArrayBufferToArrayBuffer(sharedBuffer: SharedArrayBuffer): ArrayBuffer {
  return new Uint8Array(sharedBuffer).slice().buffer;
}

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  const output = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  if (output instanceof SharedArrayBuffer) return sharedArrayBufferToArrayBuffer(output);
  return output;
}

function toUint8Array(buffer: Buffer | ArrayBuffer): Uint8Array {
  if (buffer instanceof Buffer) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else {
    return new Uint8Array(buffer);
  }
}

export { toArrayBuffer, toUint8Array };
