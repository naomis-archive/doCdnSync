import { mkdir, stat, writeFile } from "fs/promises";
import { join } from "path";
import { Readable } from "stream";

import {
  ListObjectsCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { Credentials } from "./interfaces/Credentials";
import { streamToBuffer } from "./utils/streamToBuffer";

/**
 * Main method for setting up dir to space.
 *
 * @param {string} baseDir Base directory to run this command in.
 * @param {Credentials} credentials Spaces credentials.
 * @returns {Promise<void>}
 */
export async function main(baseDir: string, credentials: Credentials) {
  const s3Client = new S3Client({
    endpoint: `https://${credentials.region}.digitaloceanspaces.com`,
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.key,
      secretAccessKey: credentials.secret,
    },
  });

  await mkdir(join(baseDir, "content"));

  console.log("Checking Space for existing files...");
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: credentials.name })
  );
  if (!data.Contents) {
    throw new Error("No data");
  }
  const files = data.Contents.filter((datum) => !datum.Key?.endsWith("/"));
  console.log(`Found ${files.length} files.`);

  for (const file of files) {
    console.log(`Downloading ${file.Key}...`);
    const filePath = file.Key?.split("/").reverse().slice(1).reverse() || [];
    const localPath = join(baseDir, "content", ...filePath);
    const localStat = await stat(localPath).catch(() => null);
    if (!localStat) {
      await mkdir(localPath);
    }
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.SPACES_NAME,
        Key: file.Key as string,
      })
    );
    if (!response.Body) {
      continue;
    }
    const body = response.Body as Readable;
    const data = await streamToBuffer(body);
    await writeFile(join(baseDir, "content", file.Key as string), data);
  }
}
