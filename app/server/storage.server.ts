import { nanoid } from "nanoid";
import { Writable } from "node:stream";
import { createWriteStream } from "node:fs";
import path from "path";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import { fileFrom } from "node-fetch";

class SizeLimitedWritable extends Writable {
  limit = 2097152;
  currentWrittenSize = 0;
  under: Writable;

  constructor(writable: Writable) {
    super();
    this.under = writable;
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    if (Buffer.isBuffer(chunk)) {
      const newSize = this.currentWrittenSize + chunk.byteLength;

      if (newSize > this.limit) {
        callback(new Error("Size limit exceeded"));
      } else {
        this.under.write(chunk);
        this.currentWrittenSize = newSize;
        callback();
      }
    }
  }
}

export const storeFile = async (
  fileData: AsyncIterable<Uint8Array>
): Promise<string> => {
  const fileId = nanoid();
  const filePath = path.join(__dirname, "..", "storage", fileId);
  const fileWritableStream = createWriteStream(filePath);

  const sizeLimitedStream = new SizeLimitedWritable(fileWritableStream);
  await writeAsyncIterableToWritable(fileData, sizeLimitedStream);
  return fileId;
};

export const getFileStream = (fileId: string) => {
  const filePath = path.join(__dirname, "..", "storage", fileId);
  return fileFrom(filePath);
};
