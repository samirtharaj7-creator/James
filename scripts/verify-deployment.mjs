import { access, readFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(process.cwd(), "out");
const productionDomain = "james.mybibleexplorer.com";

const requiredFiles = [
  "index.html",
  "404.html",
  ".nojekyll",
  "CNAME",
  "background/index.html",
  "articles/index.html",
  "james/1/index.html",
  "james/2/index.html",
  "james/3/index.html",
  "james/4/index.html",
  "james/5/index.html",
  "og.png",
  "assets/james-hero-engraving.jpg",
  "assets/my-bible-explorer-logo.png"
];

const removedArticlePaths = [
  "articles/how-to-read-james",
  "articles/faith-that-works-james-2",
  "articles/wisdom-speech-and-peace-james-3"
];

const missingFiles = [];
for (const relativePath of requiredFiles) {
  if (!(await exists(path.join(outputRoot, relativePath)))) {
    missingFiles.push(relativePath);
  }
}

if (missingFiles.length > 0) {
  fail(`Missing deployment files:\n${missingFiles.map((file) => `  - out/${file}`).join("\n")}`);
}

const cname = (await readFile(path.join(outputRoot, "CNAME"), "utf8")).trim();
if (cname !== productionDomain) {
  fail(`out/CNAME must contain exactly ${productionDomain}; found ${JSON.stringify(cname)}.`);
}

const staleArticlePaths = [];
for (const relativePath of removedArticlePaths) {
  if (await exists(path.join(outputRoot, relativePath))) {
    staleArticlePaths.push(relativePath);
  }
}

if (staleArticlePaths.length > 0) {
  fail(`Removed articles are still present:\n${staleArticlePaths.map((item) => `  - out/${item}`).join("\n")}`);
}

console.log(`Deployment artifact verified: ${requiredFiles.length} required files present, custom domain set, and removed articles absent.`);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`Deployment verification failed.\n${message}`);
  process.exit(1);
}
