import { mkdir, stat, writeFile } from "fs/promises";
import { join } from "path";
import { Readable } from "stream";

import {
  ListObjectsCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { streamToBuffer } from "./utils/streamToBuffer";

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "sfo3",
  credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string,
  },
});

(async () => {
  await mkdir(join(process.cwd(), "content"));

  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: process.env.SPACES_NAME })
  );
  if (!data.Contents) {
    throw new Error("No data");
  }
  const files = data.Contents.filter((datum) => !datum.Key?.endsWith("/"));

  for (const file of files) {
    const filePath = file.Key?.split("/").reverse().slice(1).reverse() || [];
    const localPath = join(process.cwd(), "content", ...filePath);
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
    await writeFile(join(process.cwd(), "content", file.Key as string), data);
  }
})();
