import { readFile, stat } from "fs/promises";
import { join, sep } from "path";
import { Readable } from "stream";

import {
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getLocalFiles } from "./utils/getLocalFiles";
import { streamToBuffer } from "./utils/streamToBuffer";

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "sfo3",
  credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string,
  },
});

/**.
 * Main method for syncing dir to space
 *
 * @param root0
 * @param root0.baseDir
 * @returns {Promise<void>}
 */
export async function main({ baseDir }: { baseDir: string }) {
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: process.env.SPACES_NAME })
  );
  if (!data.Contents) {
    throw new Error("No data");
  }
  const files = data.Contents.filter((datum) => !datum.Key?.endsWith("/"));

  for (const file of files) {
    const filePath = file.Key?.split("/") || [];
    const localPath = join(baseDir, "content", ...filePath);
    const localStat = await stat(localPath).catch(() => null);
    if (!localStat) {
      console.log(`Deleting ${file.Key}`);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.SPACES_NAME,
          Key: file.Key as string,
        })
      );
    }
  }

  const localFiles = await getLocalFiles(baseDir);

  for (const local of localFiles) {
    const splitFileDir = local.split(sep);
    const contentDirIndex = splitFileDir.indexOf("content");
    const fileKey = splitFileDir.slice(contentDirIndex + 1).join("/");

    const cdnData = await s3Client
      .send(
        new GetObjectCommand({ Bucket: process.env.SPACES_NAME, Key: fileKey })
      )
      .catch(() => null);
    if (!cdnData) {
      console.log(`${local} is new! Uploading...`);
      const localBuffer = await readFile(local);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.SPACES_NAME,
          Key: fileKey,
          Body: localBuffer,
          ACL: "public-read",
        })
      );
      continue;
    }
    const cdnBuffer = await streamToBuffer(cdnData.Body as Readable);

    const localBuffer = await readFile(local);

    if (localBuffer.equals(cdnBuffer)) {
      console.log(`${local} is up to date`);
      continue;
    }
    console.log(`${local} is out of date. Deleting CDN copy...`);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.SPACES_NAME,
        Key: fileKey,
      })
    );
    console.log("Uploading local copy...");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.SPACES_NAME,
        Key: fileKey,
        Body: localBuffer,
        ACL: "public-read",
      })
    );
  }
}
