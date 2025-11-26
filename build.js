import fs from 'fs/promises';
import path from 'path';

start();

/** Build the site. */
async function start() {
  const template = await fs.readFile('template.html', 'utf-8');
  const pages = listFilesFlat('pages');

  for await (const page of pages) {
    if (!page.name.endsWith('.html')) continue;

    const data = await fs.readFile(page.path, 'utf-8');
    const content = makePage(template, data);

    const outPath = 'static/' + page.name.replace(/__/g, '/');
    const outDir = path.dirname(outPath);

    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outPath, content);
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

/** List all files in the directory. */
async function* listFilesFlat(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      yield {
        name: entry.name,
        path: path.join(directoryPath, entry.name),
      };
    }
  }
}
