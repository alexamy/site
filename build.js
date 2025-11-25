import fs from 'fs/promises';
import path from 'path';

const pagesPath = 'pages';
const distsPath = 'dist';
const templatePath = 'template.html';

start();

async function start() {
  const template = await fs.readFile(templatePath, 'utf-8');

  for await (const pagePath of listFiles(pagesPath)) {
    if (!pagePath.endsWith('.html')) continue;

    const data = await fs.readFile(pagePath, 'utf-8');
    const page = makePage(template, data);
    const distPath = pagePath.replace(pagesPath, distsPath);

    console.log(data);
  }
}

function makePage(template, data) {
  return '';
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
