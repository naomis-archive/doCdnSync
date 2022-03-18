import { readdir, stat } from "fs/promises";
import { join } from "path";

const walkDirectory = async (dir: string): Promise<string[]> => {
  const fileNames = [];
  const files = await readdir(dir);
  for (const file of files) {
    const status = await stat(join(dir, file));
    if (status.isDirectory()) {
      fileNames.push(...(await walkDirectory(join(dir, file))));
    }
    if (status.isFile()) {
      fileNames.push(join(dir, file));
    }
  }
  return fileNames;
};

/**
 * Module to generate the local file list for the contents directory.
 *
 * @param baseDir
 * @returns {Promise<string[]>} An array containing file paths for everything in `contents`.
 */
export const getLocalFiles = async (baseDir: string) => {
  const contents = await walkDirectory(join(baseDir, "content"));
  return contents;
};
