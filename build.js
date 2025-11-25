import fs from 'fs/promises';
import path from 'path';

const pagesPath = './pages';

start();

async function start() {
  for await (const filePath of listFiles(pagesPath)) {
    console.log(filePath);
  }
}

async function* listFiles(directoryPath) {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        yield* listFiles(fullPath);
      } else if (entry.isFile()) {
        yield fullPath;
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${directoryPath}:`, err.message);
    return fileList;
  }
}
