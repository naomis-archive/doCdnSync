import { Readable } from "stream";

/**
 * Module to convert the Readable stream from the S3 download into a buffer.
 *
 * @param { Readable } stream The S3 download stream.
 * @returns { Promise<Buffer> } A buffer containing the contents of the stream.
 */
export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk as Uint8Array));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};
