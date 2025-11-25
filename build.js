import fs from 'fs/promises';
import path from 'path';

async function readFilesRecursively(dirPath, fileList = []) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await readFilesRecursively(fullPath, fileList);
      } else if (entry.isFile()) {
        fileList.push(fullPath);
      }
    }

    return fileList;
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err.message);
    return fileList;
  }
}
