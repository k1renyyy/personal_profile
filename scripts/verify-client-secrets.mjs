import {readdir, readFile} from "node:fs/promises";
import path from "node:path";

const secretNames = [
  "SANITY_API_READ_TOKEN",
  "SANITY_API_WRITE_TOKEN",
  "SANITY_PREVIEW_TOKEN",
  "SANITY_WEBHOOK_SECRET",
];

const secrets = secretNames
  .map((name) => ({name, value: process.env[name]}))
  .filter(({value}) => typeof value === "string" && value.length > 0);

const roots = [".next/static", ".next/server/app", "out"];

async function* filesUnder(directory) {
  let entries;
  try {
    entries = await readdir(directory, {withFileTypes: true});
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* filesUnder(entryPath);
    else if (entry.isFile()) yield entryPath;
  }
}

const findings = [];
for (const root of roots) {
  for await (const file of filesUnder(root)) {
    const content = await readFile(file);
    for (const secret of secrets) {
      if (content.includes(Buffer.from(secret.value))) {
        findings.push(`${secret.name} found in ${file}`);
      }
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log(`Client output secret scan passed (${secrets.length} configured values checked).`);
