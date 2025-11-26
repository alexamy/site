import fs from 'fs/promises';
import path from 'path';

start();

/** Build the site. */
async function start() {
  const template = await fs.readFile('template.html', 'utf-8');

  for await (const pagePath of listFiles('pages')) {
    if (!pagePath.endsWith('.html')) continue;

    const data = await fs.readFile(pagePath, 'utf-8');
    const page = makePage(template, data);

    const outPath = pagePath.replace(/^pages/, 'static');
    const outDir = path.dirname(outPath);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outPath, page);
  }
}

/** Insert page data into the template. */
function makePage(template, data) {
  const parts = data.split('<!---->').map((s) => s.trim());

  if (parts.length !== 2) {
    throw new Error('Use single page separator only! (<!---->)');
  }

  const [head, body] = parts;
  const page = template.replace('{{head}}', head).replace('{{body}}', body);

  return page;
}

/** Recursively list all files in the directory. */
async function* listFiles(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      yield* listFiles(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}
