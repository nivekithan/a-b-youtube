import { nanoid } from "nanoid";
import type { Readable } from "stream";
import { Writable } from "node:stream";
import { createWriteStream, rm } from "node:fs";
import path from "path";
import { createReadStream } from "fs";

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

export const storeFile = async (fileData: Readable) => {
  const fileName = nanoid();
  const filePath = path.join(__dirname, "..", "..", "storage", fileName);
  const fileWritableStream = createWriteStream(filePath);

  const sizeLimitedStream = new SizeLimitedWritable(fileWritableStream);

  return new Promise<string>((resolve, reject) => {
    fileData.pipe(sizeLimitedStream);

    fileWritableStream.on("finish", () => {
      resolve(fileName);
    });

    fileWritableStream.on("error", (err) => {
      rm(filePath, () => {
        reject(err);
      });
    });
  });
};

export const getFileStream = (fileId: string) => {
  const filePath = path.join(__dirname, "..", "..", "storage", fileId);
  return createReadStream(filePath);
};
