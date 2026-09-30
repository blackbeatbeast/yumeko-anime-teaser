import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const result = spawnSync(process.execPath, ['node_modules/vinext/dist/cli.js', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true' },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
// Pages mounts this artifact at /yumeko-anime-teaser/. Flatten Vinext's
// assetPrefix folder so that URLs retain exactly one repository prefix.
const prefix = '/yumeko-anime-teaser';
const target = 'dist/pages';
mkdirSync(target, { recursive: true });
for (const name of readdirSync('dist/client')) {
  if (name !== prefix.slice(1)) cpSync(`dist/client/${name}`, `${target}/${name}`, { recursive: true });
}
cpSync(`dist/client${prefix}/_next`, `${target}/_next`, { recursive: true });
writeFileSync(`${target}/.nojekyll`, '');
const html = readFileSync(`${target}/index.html`, 'utf8');
if (!html.includes('ゆめこ、今日も創作中。')) throw new Error('Missing rendered home page');
for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (!url.startsWith('/')) continue;
  if (!url.startsWith(`${prefix}/`)) throw new Error(`Incorrect Pages URL: ${url}`);
  if (!existsSync(`${target}${url.slice(prefix.length)}`)) throw new Error(`Missing Pages asset: ${url}`);
}
console.log('Pages HTML and all referenced local resources verified.');
